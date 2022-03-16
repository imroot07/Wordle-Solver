function z() {
    String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }
    var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET',
            url,
            true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            callback(xhr.response);
        };
        xhr.send();
    };
    var rows = document.getElementsByClassName('Row');
    var words = [];
    var correct = [];
    var incorrect = [];
    var wrong_spot = [];
    var word_len = 0;
    getJSON('https://raw.githubusercontent.com/words/an-array-of-english-words/master/index.json',
        (dict) => {
            try {
                word_len = rows[0].children.length;
                for (let i = 0; i < word_len; i++) {
                    correct.push('');
                    wrong_spot.push([]);
                    incorrect.push([]);
                }
                for (let x = 0; x < rows.length; x++) {
                    var row = rows[x].children;
                    let word = '';
                    let data = '';
                    if (rows[x].className == 'Row Row-locked-in') {
                        for (let l = 0; l < row.length; l++) {
                            var char = row[l].innerHTML[0];
                            if (char !== '<') {
                                if (row[l].className == 'Row-letter letter-absent') {
                                    data += '0';
                                    if (incorrect[l].indexOf(char) == -1) incorrect[l].push(char);
                                } else if (row[l].className == 'Row-letter letter-correct') {
                                    data += '1';
                                    correct[l] = char;
                                } else if (row[l].className == 'Row-letter letter-elsewhere') {
                                    data += '2';
                                    if (wrong_spot[l].indexOf(char) == -1) wrong_spot[l].push(char);
                                }
                            }
                            word += char;
                        }
                        words.push([
                            word.toLowerCase(),
                            data,
                        ]);
                    }
                }

                // correct = ['', 'u', '', '', 'e'];
                // incorrect = [['d', 't'], ['l'], ['c', 'a'], ['k', 'i', 'n'], ['s', 'n']];
                // wrong_spot = [['p'], ['r'], [], [], []];

                var length_words = [];
                for (let i = 0; i < dict.length; i++) {
                    var word = dict[i];
                    if (word.length == word_len) length_words.push(word);
                }
                var step1 = [];
                for (let i = 0; i < length_words.length; i++) {
                    var word = length_words[i];
                    let bad = false;
                    for (let idx = 0; idx < correct.length; idx++) {
                        if (correct[idx] !== '') {
                            if (word[idx] !== correct[idx]) {
                                bad = true;
                            }
                        }
                    }
                    if (bad == false) {
                        step1.push(word);
                    }
                }
                var step2 = [];
                for (let i = 0; i < step1.length; i++) {
                    var word = step1[i];
                    let bad = false;
                    for (let idx = 0; idx < wrong_spot.length; idx++) {
                        for (let l = 0; l < wrong_spot[idx].length; l++) {
                            if (word[idx] == wrong_spot[idx][l]) {
                                bad = true;
                            } else if (word.indexOf(wrong_spot[idx][l]) == -1) {
                                bad = true;
                            }
                        }
                    }
                    if (bad == false) {
                        step2.push(word);
                    }
                }
                var step3 = [];
                var wrong = [];
                for (let i = 0; i < wrong_spot.length; i++) {
                    for (let l = 0; l < wrong_spot[i].length; l++) {
                        wrong.push(wrong_spot[i][l]);
                    }
                }
                for (let i = 0; i < step2.length; i++) {
                    var word = step2[i];
                    let bad = false;
                    var temp = word;
                    for (let l = 0; l < correct.length; l++) {
                        if (word[l] == correct[l]) {
                            temp = temp.replaceAt(l, '_');
                        }
                    }
                    for (let idx = 0; idx < incorrect.length; idx++) {
                        for (let l = 0; l < incorrect[idx].length; l++) {
                            if (wrong.indexOf(incorrect[idx][l]) == -1) {
                                if (temp.indexOf(incorrect[idx][l]) !== -1) {
                                    bad = true;
                                }
                            } else if (word[idx] == incorrect[idx][l]) {
                                bad = true;
                            }
                        }
                    }
                    if (bad == false) {
                        step3.push(word);
                    }
                }
                alert(step3);
            } catch (err) {
                alert(err);
                // optional
                // I used alert("You are not on the correct page.");
                // because that is the most common cause of the error
            }
        });
}
z();