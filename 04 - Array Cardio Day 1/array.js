    // Get your shorts on - this is an array workout!
    // ## Array Cardio Day 1

    ( () => {
        
        const inventors = [
            { first: 'Albert', last: 'Einstein', year: 1879, passed: 1955 },
            { first: 'Isaac', last: 'Newton', year: 1643, passed: 1727 },
            { first: 'Galileo', last: 'Galilei', year: 1564, passed: 1642 },
            { first: 'Marie', last: 'Curie', year: 1867, passed: 1934 },
            { first: 'Johannes', last: 'Kepler', year: 1571, passed: 1630 },
            { first: 'Nicolaus', last: 'Copernicus', year: 1473, passed: 1543 },
            { first: 'Max', last: 'Planck', year: 1858, passed: 1947 },
            { first: 'Katherine', last: 'Blodgett', year: 1898, passed: 1979 },
            { first: 'Ada', last: 'Lovelace', year: 1815, passed: 1852 },
            { first: 'Sarah E.', last: 'Goode', year: 1855, passed: 1905 },
            { first: 'Lise', last: 'Meitner', year: 1878, passed: 1968 },
            { first: 'Hanna', last: 'Hammarström', year: 1829, passed: 1909 }
        ];

        // Array.prototype.filter()
        // 1. Filter the list of inventors for those who were born in the 1500's
        console.log("1. Filter the list of inventors for those who were born in the 1500's");
        const bornIn1500s = inv => (inv.year >= 1500 && inv.year <= 1600);
        const filtered = inventors.filter( bornIn1500s );
        console.log(filtered);
        console.log('\n');

        // Array.prototype.map()
        // 2. Give us an array of the inventors' first and last names
        console.log("2. Give us an array of the inventors' first and last names");
        const fullNames = inv => `${inv.first} ${inv.last}`;
        const mapped = inventors.map( fullNames );
        console.log(mapped);
        console.log('\n');
    
        // Array.prototype.sort()
        // 3. Sort the inventors by birthdate, oldest to youngest
        console.log("3. Sort the inventors by birthdate, oldest to youngest");
        const birthDateDifference = (a,b) => a.year - b.year;
        const sortedBirthDate = inventors.sort( birthDateDifference );
        console.log(sortedBirthDate);
        console.log('\n');
    
        // Array.prototype.reduce()
        // 4. How many years did all the inventors live?
        console.log("4. How many years did all the inventors live?");
        const yearsLived = ({passed, year}) => passed - year;
        const totalYearsLived = (acc, curr) => acc + yearsLived(curr);
        const reduced = inventors.reduce( totalYearsLived , 0)
        console.log(reduced);
        console.log('\n');
    
        // 5. Sort the inventors by years lived
        console.log("5. Sort the inventors by years lived");
        const livedDifference = (a,b) => yearsLived(a) - yearsLived(b);
        const sortedYearsLived = inventors.sort( livedDifference );
        console.log(sortedYearsLived);
        console.log('\n');
    })();
    
    ( () => {
        const people = ['Beck, Glenn', 'Becker, Carl', 'Beckett, Samuel', 'Beddoes, Mick', 'Beecher, Henry', 'Beethoven, Ludwig', 'Begin, Menachem', 'Belloc, Hilaire', 'Bellow, Saul', 'Benchley, Robert', 'Benenson, Peter', 'Ben-Gurion, David', 'Benjamin, Walter', 'Benn, Tony', 'Bennington, Chester', 'Benson, Leana', 'Bent, Silas', 'Bentsen, Lloyd', 'Berger, Ric', 'Bergman, Ingmar', 'Berio, Luciano', 'Berle, Milton', 'Berlin, Irving', 'Berne, Eric', 'Bernhard, Sandra', 'Berra, Yogi', 'Berry, Halle', 'Berry, Wendell', 'Bethea, Erin', 'Bevan, Aneurin', 'Bevel, Ken', 'Biden, Joseph', 'Bierce, Ambrose', 'Biko, Steve', 'Billings, Josh', 'Biondo, Frank', 'Birrell, Augustine', 'Black, Elk', 'Blair, Robert', 'Blair, Tony', 'Blake, William'];
        
        // 6. sort Exercise
        // Sort the people alphabetically by last name
        console.log("6. sort Exercise");
        const getLastName = person => person.split(', ')[0];
        const compareLastNames = (a,b) =>
        (getLastName(a) < getLastName(b)) ? -1 : 1;
        const sortedPeople = people.sort( compareLastNames );
        console.log(sortedPeople);
        console.log('\n');
    })();
    
    ( () => {
        // 7. Reduce Exercise
        // Sum up the instances of each of these
        console.log("7. Reduce Exercise");
        const data = ['car', 'car', 'truck', 'truck', 'bike', 'walk', 'car', 'van', 'bike', 'walk', 'car', 'van', 'car', 'truck' ];
        const countOccurences = (acc, curr) => {
            (acc[curr]) ? acc[curr] += 1 : acc[curr] = 1;
            return acc;
        };
        const instances = data.reduce( countOccurences ,{});
        console.log(instances);
        console.log('\n')
    })();
    
    // 8. create a list of Boulevards in Paris that contain 'de' anywhere in the name
    // https://en.wikipedia.org/w/api.php?cmtitle=Category:Boulevards_in_Paris&action=query&list=categorymembers&cmlimit=50&format=json&origin=*
    console.log("8. create a list of Boulevards in Paris that contain 'de' anywhere in the name");
    ( () => {

        fetch('https://en.wikipedia.org/w/api.php?cmtitle=Category:Boulevards_in_Paris&action=query&list=categorymembers&cmlimit=50&format=json&origin=*')
            .then( res => res.json() )
            .then( data => data)
        .then( data => {
            const nameIncludesDe = x => x.includes('de');
            const getTitle = x => x.title;
            const result = data.query.categorymembers
                            .map( getTitle )
                            .filter( nameIncludesDe )
            result.forEach( x => console.log(x));
        });
        console.log('\n');
    })();