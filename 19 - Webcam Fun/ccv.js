let parallable;
if (parallable === undefined) {
	parallable = function (file, funct) {
		parallable.core[funct.toString()] = funct().core;
		return function () {
			let i;
			let async;
			let workerNum;
			let params;
			if (arguments.length > 1) {
				async = arguments[arguments.length - 2];
				workerNum = arguments[arguments.length - 1];
				params = new Array(arguments.length - 2);
				for (i = 0; i < arguments.length - 2; i++)
					params[i] = arguments[i];
			} else {
				async = arguments[0].async;
				workerNum = arguments[0].worker;
				params = arguments[0];
				delete params["async"];
				delete params["worker"];
				params = [params];
			}
			const scope = { "shared" : {} };
			const ctrl = funct.apply(scope, params);
			if (async) {
				return function (complete, error) {
					let executed = 0;
					const outputs = new Array(workerNum);
					const inputs = ctrl.pre.apply(scope, [workerNum]);
					/* sanitize scope shared because for Chrome/WebKit,
					worker only support JSONable data */
					for (i in scope.shared)
						/* delete function, if any */
						if (typeof scope.shared[i] === "function")
							delete scope.shared[i];
						/* delete DOM object, if any */
						else if (scope.shared[i].tagName !== undefined)
							delete scope.shared[i];
					for (i = 0; i < workerNum; i++) {
						const worker = new Worker(file);
						worker.onmessage = (function (i) {
							return function (event) {
								outputs[i] = (typeof event.data === "string") ?
									JSON.parse(event.data) :
									event.data;
								executed++;
								if (executed === workerNum)
									complete(ctrl.post.apply(scope, [outputs]));
							}
						})(i);
						const msg = { "input" : inputs[i],
									"name" : funct.toString(),
									"shared" : scope.shared,
									"id" : i,
									"worker" : params.worker_num };
						try {
							worker.postMessage(msg);
						} catch (e) {
							worker.postMessage(JSON.stringify(msg));
						}
					}
				}
			} else {
				return ctrl.post.apply(
					scope,
					[[ctrl.core.apply(scope, [ctrl.pre.apply(scope, [1])[0], 0, 1])]]
				);
			}
		}
	};
	parallable.core = {};
}

function getNamedArguments(params, names) {
	if (params.length > 1) {
		const newParams = {};
		for (let i = 0; i < names.length; i++)
			newParams[names[i]] = params[i];
		return newParams;
	} else if (params.length === 1) {
		return params[0];
	}
	return {};
}

const ccv = {
	pre : function (image) {
		if (image.tagName.toLowerCase() === "img") {
			const canvas = document.createElement("canvas");
			document.body.appendChild(image);
			canvas.width = image.offsetWidth;
			canvas.style.width = `${ image.offsetWidth.toString() }px`;
			canvas.height = image.offsetHeight;
			canvas.style.height = `${ image.offsetHeight.toString() }px`;
			document.body.removeChild(image);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);
			return canvas;
		}
		return image;
	},

	arrayGroup : function (seq, gfunc) {
		let i;
		let j;
		const node = new Array(seq.length);
		for (i = 0; i < seq.length; i++)
			node[i] = {"parent" : -1,
					   "element" : seq[i],
					   "rank" : 0};
		for (i = 0; i < seq.length; i++) {
			if (!node[i].element)
				continue;
			let root = i;
			while (node[root].parent !== -1)
				root = node[root].parent;
			for (j = 0; j < seq.length; j++) {
				if( i !== j && node[j].element
					&& gfunc(node[i].element, node[j].element)) {
					let root2 = j;

					while (node[root2].parent  !== -1)
						root2 = node[root2].parent;

					if(root2  !== root) {
						if(node[root].rank > node[root2].rank)
							node[root2].parent = root;
						else {
							node[root].parent = root2;
							if (node[root].rank === node[root2].rank)
							node[root2].rank++;
							root = root2;
						}

						/* compress path from node2 to the root: */
						let temp;
						let node2 = j;
						while (node[node2].parent  !== -1) {
							temp = node2;
							node2 = node[node2].parent;
							node[temp].parent = root;
						}

						/* compress path from node to the root: */
						node2 = i;
						while (node[node2].parent  !== -1) {
							temp = node2;
							node2 = node[node2].parent;
							node[temp].parent = root;
						}
					}
				}
			}
		}
		const idx = new Array(seq.length);
		let class_idx = 0;
		for(i = 0; i < seq.length; i++) {
			j = -1;
			let node1 = i;
			if(node[node1].element) {
				while (node[node1].parent  !== -1)
					node1 = node[node1].parent;
				if(node[node1].rank >= 0)
					node[node1].rank = ~class_idx++;
				j = ~node[node1].rank;
			}
			idx[i] = j;
		}
		return {
			"index" : idx,
			"cat" : class_idx,
		};
	},

	detectObjects : parallable("ccv.js", function (canvas, cascade, interval, minNeighbors) {
		if (this.shared !== undefined) {
			const params = getNamedArguments(
				arguments, ["canvas", "cascade", "interval", "minNeighbors"]
			);
			this.shared.canvas = params.canvas;
			this.shared.interval = params.interval;
			this.shared.minNeighbors = params.minNeighbors;
			this.shared.cascade = params.cascade;
			this.shared.scale = Math.pow(2, 1 / (params.interval + 1));
			this.shared.next = params.interval + 1;
			this.shared.scaleUpto = 
				Math.floor(
					Math.log(
						Math.min(
							params.canvas.width / params.cascade.width,
							params.canvas.height / params.cascade.height
						)
					) / Math.log(this.shared.scale));
			let i;
			for (i = 0; i < this.shared.cascade.stageClassifier.length; i++)
				this.shared.cascade.stageClassifier[i].origFeature =
				    this.shared.cascade.stageClassifier[i].feature;
		}

		function pre(workerNum) {
			const { canvas, interval, scale, next, scaleUpto, } = this.shared;
			const pyr = new Array((scaleUpto + next * 2) * 4);
			const ret = new Array((scaleUpto + next * 2) * 4);

			pyr[0] = canvas;
			ret[0] = {
				"width" : pyr[0].width,
				"height" : pyr[0].height,
				"data" : pyr[0].getContext("2d")
							   .getImageData(0, 0, pyr[0].width, pyr[0].height).data };
			let i;
			for (i = 1; i <= interval; i++) {
				pyr[i * 4] = document.createElement("canvas");
				pyr[i * 4].width = Math.floor(pyr[0].width / Math.pow(scale, i));
				pyr[i * 4].height = Math.floor(pyr[0].height / Math.pow(scale, i));
				pyr[i * 4].getContext("2d")
						  .drawImage(pyr[0], 0, 0, pyr[0].width, pyr[0].height, 0, 0, pyr[i * 4].width, pyr[i * 4].height);
				ret[i * 4] = {
					"width" : pyr[i * 4].width,
					"height" : pyr[i * 4].height,
					"data" : pyr[i * 4].getContext("2d")
					               .getImageData(0, 0, pyr[i * 4].width, pyr[i * 4].height).data,
				};
			}
			for (i = next; i < scaleUpto + next * 2; i++) {
				pyr[i * 4] = document.createElement("canvas");
				pyr[i * 4].width = Math.floor(pyr[i * 4 - next * 4].width / 2);
				pyr[i * 4].height = Math.floor(pyr[i * 4 - next * 4].height / 2);
				pyr[i * 4].getContext("2d")
				          .drawImage(pyr[i * 4 - next * 4], 0, 0, pyr[i * 4 - next * 4].width, pyr[i * 4 - next * 4].height, 0, 0, pyr[i * 4].width, pyr[i * 4].height);
				ret[i * 4] = {
					"width" : pyr[i * 4].width,
					"height" : pyr[i * 4].height,
					"data" : pyr[i * 4].getContext("2d")
									.getImageData(0, 0, pyr[i * 4].width, pyr[i * 4].height).data,
				};
			}
			for (i = next * 2; i < scaleUpto + next * 2; i++) {
				pyr[i * 4 + 1] = document.createElement("canvas");
				pyr[i * 4 + 1].width = Math.floor(pyr[i * 4 - next * 4].width / 2);
				pyr[i * 4 + 1].height = Math.floor(pyr[i * 4 - next * 4].height / 2);
				pyr[i * 4 + 1].getContext("2d")
							.drawImage(pyr[i * 4 - next * 4], 1, 0, pyr[i * 4 - next * 4].width - 1, pyr[i * 4 - next * 4].height, 0, 0, pyr[i * 4 + 1].width - 2, pyr[i * 4 + 1].height);
				ret[i * 4 + 1] = {
					"width" : pyr[i * 4 + 1].width,
					"height" : pyr[i * 4 + 1].height,
					"data" : pyr[i * 4 + 1].getContext("2d").getImageData(0, 0, pyr[i * 4 + 1].width, pyr[i * 4 + 1].height).data,
				};
				pyr[i * 4 + 2] = document.createElement("canvas");
				pyr[i * 4 + 2].width = Math.floor(pyr[i * 4 - next * 4].width / 2);
				pyr[i * 4 + 2].height = Math.floor(pyr[i * 4 - next * 4].height / 2);
				pyr[i * 4 + 2].getContext("2d")
							.drawImage(pyr[i * 4 - next * 4], 0, 1, pyr[i * 4 - next * 4].width, pyr[i * 4 - next * 4].height - 1, 0, 0, pyr[i * 4 + 2].width, pyr[i * 4 + 2].height - 2);
				ret[i * 4 + 2] = {
					"width" : pyr[i * 4 + 2].width,
					"height" : pyr[i * 4 + 2].height,
					"data" : pyr[i * 4 + 2].getContext("2d")
									.getImageData(0, 0, pyr[i * 4 + 2].width, pyr[i * 4 + 2].height).data,
				};
				pyr[i * 4 + 3] = document.createElement("canvas");
				pyr[i * 4 + 3].width = Math.floor(pyr[i * 4 - next * 4].width / 2);
				pyr[i * 4 + 3].height = Math.floor(pyr[i * 4 - next * 4].height / 2);
				pyr[i * 4 + 3].getContext("2d")
							.drawImage(pyr[i * 4 - next * 4], 1, 1, pyr[i * 4 - next * 4].width - 1, pyr[i * 4 - next * 4].height - 1, 0, 0, pyr[i * 4 + 3].width - 2, pyr[i * 4 + 3].height - 2);
				ret[i * 4 + 3] = {
					"width" : pyr[i * 4 + 3].width,
					"height" : pyr[i * 4 + 3].height,
					"data" : pyr[i * 4 + 3].getContext("2d")
									.getImageData(0, 0, pyr[i * 4 + 3].width, pyr[i * 4 + 3].height).data,
				};
			}
			return [ret];
		};

		function core(pyr, id, worker_num) {
			const { cascade, interval, scale, next, scaleUpto, } = this.shared;
			let i;
			let j;
			let k;
			let x;
			let y;
			let q;
			let scale_x = 1;
			let scale_y = 1;
			const dx = [0, 1, 0, 1];
			const dy = [0, 0, 1, 1];
			const seq = [];
			for (i = 0; i < scaleUpto; i++) {
				const qw = pyr[i * 4 + next * 8].width - Math.floor(cascade.width / 4);
				const qh = pyr[i * 4 + next * 8].height - Math.floor(cascade.height / 4);
				const step = [
					pyr[i * 4].width * 4,
					pyr[i * 4 + next * 4].width * 4,
					pyr[i * 4 + next * 8].width * 4,
				];
				const paddings = [
					pyr[i * 4].width * 16 - qw * 16,
					pyr[i * 4 + next * 4].width * 8 - qw * 8,
					pyr[i * 4 + next * 8].width * 4 - qw * 4,
				];
				for (j = 0; j < cascade.stageClassifier.length; j++) {
					const { origFeature } = cascade.stageClassifier[j];
					cascade.stageClassifier[j].feature = new Array(cascade.stageClassifier[j].count)
					const { feature } = cascade.stageClassifier[j];
					for (k = 0; k < cascade.stageClassifier[j].count; k++) {
						feature[k] = {
							"size" : origFeature[k].size,
							"px" : new Array(origFeature[k].size),
							"pz" : new Array(origFeature[k].size),
							"nx" : new Array(origFeature[k].size),
							"nz" : new Array(origFeature[k].size),
						};
						for (q = 0; q < origFeature[k].size; q++) {
							feature[k].px[q] = origFeature[k].px[q] * 4
								+ origFeature[k].py[q] * step[origFeature[k].pz[q]];
							feature[k].pz[q] = origFeature[k].pz[q];
							feature[k].nx[q] = origFeature[k].nx[q] * 4
								+ origFeature[k].ny[q] * step[origFeature[k].nz[q]];
							feature[k].nz[q] = origFeature[k].nz[q];
						}
					}
				}
				for (q = 0; q < 4; q++) {
					const u8 = [
						pyr[i * 4].data, 
						pyr[i * 4 + next * 4].data,
						pyr[i * 4 + next * 8 + q].data,
					];
					const u8o = [
						dx[q] * 8 + dy[q] * pyr[i * 4].width * 8,
						dx[q] * 4 + dy[q] * pyr[i * 4 + next * 4].width * 4,
						0,
					];
					for (y = 0; y < qh; y++) {
						for (x = 0; x < qw; x++) {
							let sum = 0;
							let flag = true;
							for (j = 0; j < cascade.stageClassifier.length; j++) {
								sum = 0;
								const { alpha, feature } = cascade.stageClassifier[j];
								for (k = 0; k < cascade.stageClassifier[j].count; k++) {
									const feature_k = feature[k];
									let p;
									let pmin = u8[ feature_k.pz[0] ][ u8o[feature_k.pz[0]] + feature_k.px[0] ];
									let n;
									let nmax = u8[ feature_k.nz[0] ][ u8o[feature_k.nz[0]] + feature_k.nx[0] ];
									if (pmin <= nmax) {
										sum += alpha[k * 2];
									} else {
										let f;
										let shortcut = true;
										for (f = 0; f < feature_k.size; f++) {
											if (feature_k.pz[f] >= 0) {
												p = u8[ feature_k.pz[f] ][ u8o[feature_k.pz[f]] + feature_k.px[f] ];
												if (p < pmin) {
													if (p <= nmax) {
														shortcut = false;
														break;
													}
													pmin = p;
												}
											}
											if (feature_k.nz[f] >= 0) {
												n = u8[ feature_k.nz[f] ][ u8o[feature_k.nz[f]] + feature_k.nx[f] ];
												if (n > nmax) {
													if (pmin <= n) {
														shortcut = false;
														break;
													}
													nmax = n;
												}
											}
										}
										sum += (shortcut) ? alpha[k * 2 + 1] : alpha[k * 2];
									}
								}
								if (sum < cascade.stageClassifier[j].threshold) {
									flag = false;
									break;
								}
							}
							if (flag) {
								seq.push({
									"x" : (x * 4 + dx[q] * 2) * scale_x,
									"y" : (y * 4 + dy[q] * 2) * scale_y,
									"width" : cascade.width * scale_x,
									"height" : cascade.height * scale_y,
									"neighbor" : 1,
									"confidence" : sum,
								});
							}
							u8o[0] += 16;
							u8o[1] += 8;
							u8o[2] += 4;
						}
						u8o[0] += paddings[0];
						u8o[1] += paddings[1];
						u8o[2] += paddings[2];
					}
				}
				scale_x *= scale;
				scale_y *= scale;
			}
			return seq;
		};

		function post(seq) {
			const { minNeighbors, cascade, interval, scale, next, scaleUpto, }  = this.shared;
			let i;
			let j;
			for (i = 0; i < cascade.stageClassifier.length; i++)
				cascade.stageClassifier[i].feature = cascade.stageClassifier[i].origFeature;
			seq = seq[0];
			if (!(minNeighbors > 0))
				return seq;
			else {
				const result = ccv.arrayGroup(seq, function (r1, r2) {
					const distance = Math.floor(r1.width * 0.25 + 0.5);

					return r2.x <= r1.x + distance &&
						   r2.x >= r1.x - distance &&
						   r2.y <= r1.y + distance &&
						   r2.y >= r1.y - distance &&
						   r2.width <= Math.floor(r1.width * 1.5 + 0.5) &&
						   Math.floor(r2.width * 1.5 + 0.5) >= r1.width;
				});
				const ncomp = result.cat;
				const idx_seq = result.index;
				const comps = new Array(ncomp + 1);
				for (i = 0; i < comps.length; i++)
					comps[i] = {
						"neighbors" : 0,
						"x" : 0,
						"y" : 0,
						"width" : 0,
						"height" : 0,
						"confidence" : 0,
					};

				// count number of neighbors
				for(i = 0; i < seq.length; i++)
				{
					const r1 = seq[i];
					const idx = idx_seq[i];

					if (comps[idx].neighbors === 0)
						comps[idx].confidence = r1.confidence;

					++comps[idx].neighbors;

					comps[idx].x += r1.x;
					comps[idx].y += r1.y;
					comps[idx].width += r1.width;
					comps[idx].height += r1.height;
					comps[idx].confidence = Math.max(comps[idx].confidence, r1.confidence);
				}

				const seq2 = [];
				// calculate average bounding box
				for(i = 0; i < ncomp; i++)
				{
					let n = comps[i].neighbors;
					if (n >= minNeighbors)
						seq2.push({
							"x" : (comps[i].x * 2 + n) / (2 * n),
							"y" : (comps[i].y * 2 + n) / (2 * n),
							"width" : (comps[i].width * 2 + n) / (2 * n),
							"height" : (comps[i].height * 2 + n) / (2 * n),
							"neighbors" : comps[i].neighbors,
							"confidence" : comps[i].confidence,
						});
				}

				const resultSeq = [];
				// filter out small face rectangles inside large face rectangles
				for(i = 0; i < seq2.length; i++)
				{
					const r1 = seq2[i];
					let flag = true;
					for(j = 0; j < seq2.length; j++)
					{
						const r2 = seq2[j];
						const distance = Math.floor(r2.width * 0.25 + 0.5);

						if(
							i  !== j &&
							r1.x >= r2.x - distance &&
							r1.y >= r2.y - distance &&
							r1.x + r1.width <= r2.x + r2.width + distance &&
							r1.y + r1.height <= r2.y + r2.height + distance &&
							(r2.neighbors > Math.max(3, r1.neighbors) || r1.neighbors < 3)
						)
						{
							flag = false;
							break;
						}
					}

					if(flag)
						resultSeq.push(r1);
				}
				return resultSeq;
			}
		};
		return {
			"pre" : pre,
			"core" : core,
			"post" : post,
		};
	})
}
