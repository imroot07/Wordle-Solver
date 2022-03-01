import requests

abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
common = 'EARIOTNSLCUDPMHGBFYWKVXZJQ'
dictionary_url = """https://github.com/words/an-array-of-english-words/blob/master/index.json?raw=true
"""

online = input('Refresh online dictionary? (y/n): ').replace(' ', '').lower() == 'y'
if online:
    try:
        print('Fetching data...')
        r = requests.get(dictionary_url)
        string = r.text.replace('"', '').replace('[', '').replace(']', '').replace('\n', '')
        dictionary = [word.upper() for word in string.split(',')]
        print('Saving data...')
        with open(r'./python/dictionary.txt', 'w') as dictionary_file:
            for idx, word in enumerate(dictionary):
                dictionary_file.write(word + '\n')
        print('Dictionary successfully updated.')
    except requests.exceptions.ConnectionError:
        print('Failed to connect to online dictionary.')
print()

dictionary = []
with open(r'./python/dictionary.txt') as dictionary_file:
    for line in dictionary_file.readlines():
        word = line.replace('\n', '').upper()
        dictionary.append(word)


def remove_idx(string, idx):
    return string[:idx] + string[idx + 1:]


def replace_idx(string, idx, char):
    return string[:idx] + char + string[idx + 1:]


five_letter_words = []
for word in dictionary:
    if len(word) == 5:
        five_letter_words.append(word)

correct = []
incorrect = []
wrong_spot = []

with open(r'./python/wordle.txt') as wordle_file:
    lines = wordle_file.readlines()
    for line in lines:
        if line != '\n':
            word, data = line.split()
            if not correct:
                correct = ['' for _ in word]
                wrong_spot = [[] for _ in word]
            for idx, char in enumerate(word):
                if data[idx] == '0' or data[idx] == 'w':
                    incorrect.append(char)
                elif data[idx] == '1' or data[idx] == 'r':
                    correct[idx] = char
                elif data[idx] == '2' or data[idx] == 'm':
                    wrong_spot[idx].append(char)
# print(correct)
# print(incorrect)
# print(wrong_spot)


def find_possible_words(correct, incorrect, wrong_spot, length=5):
    all_words = []
    for word in dictionary:
        if len(word) == length:
            all_words.append(word)
    word_layer1 = []
    # remove words that don't have the correct letters
    for word in all_words:
        wrong = False
        for index, letter in enumerate(correct):
            if letter != '' and word[index] != letter.upper():
                wrong = True
        if not wrong:
            word_layer1.append(word)

    # print(word_layer1)

    word_layer2 = []
    # remove words that have incorrect letters
    for word in word_layer1:
        wrong = False
        for letter in incorrect:
            if letter.upper() in word:
                temp_word = word
                for index, correct_letter in enumerate(correct):
                    if correct_letter != '':
                        temp_word = replace_idx(temp_word, index, '_')
                for index, letters in enumerate(wrong_spot):
                    for wrong_letter in letters:
                        if wrong_letter.upper() == letter.upper():
                            new = ''
                            for idx, char in enumerate(temp_word):
                                if char.upper() == letter.upper() and idx != index:
                                    new += '_'
                                else:
                                    new += char
                            # temp_word = replace_idx(temp_word, index, '_')
                            temp_word = new
                if letter.upper() in temp_word:
                    wrong = True
        if not wrong:
            word_layer2.append(word)

    # print(word_layer2)

    word_layer3 = []
    # remove words that don't have the wrong spot letters or do have letters in the wrong spot
    for word in word_layer2:
        wrong = False
        for index, letters in enumerate(wrong_spot):
            for letter in letters:
                if letter.upper() not in word:
                    wrong = True
                elif word[index] == letter.upper():
                    wrong = True
        if not wrong:
            word_layer3.append(word)

    return word_layer3


def get_most_common(word_list: list):
    def get_count(word):
        count = 0
        done = []
        for char in word:
            if char not in done:
                count += common.index(char.upper())
                done.append(char)
            else:
                count += len(common) - common.index(char.upper())
        return count
    sorted_words = word_list.copy()
    sorted_words.sort(key=get_count)
    return sorted_words


print('Possible words:', get_most_common(find_possible_words(correct, incorrect, wrong_spot, len(correct))))
