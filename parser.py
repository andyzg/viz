import re
from urlparse import urlparse
from random import randint

possible_domains =  ["DOMAIN_2", "DOMAIN_2", "DOMAIN_3", "DOMAIN_4", "DOMAIN_5",
    "DOMAIN_6", "DOMAIN_7", "DOMAIN_8", "DOMAIN_9", "DOMAIN_10", "DOMAIN_11",
    "DOMAIN_12", "DOMAIN_13", "DOMAIN_14", "DOMAIN_15", "DOMAIN_16",
    "DOMAIN_17", "DOMAIN_18", "DOMAIN_19", "DOMAIN_20"
]

def main():
  file = open("data.txt", "ra")
  data = re.sub(" +", " ,", file.read())
  lines = data.split("\n")
  new_stuff = []
  new_stuff.append("var data = [")
  for i in lines:
    stuff = i.split(",")
    if len(stuff) == 3:
      one, two, num = stuff
      new_stuff.append("\t[\"" + one + "\", \"" + two + "\", \"" + str(randint(100, 10000)) + "\"],");

  new_stuff.append("];");
  formatted_data = '\n'.join(new_stuff);
  output = open("result.js", "w")
  output.write(formatted_data)
  return

def format(string):
    return "\"" + string + "\""

def new_data():
    LINES = len(possible_domains) ** 2 * 4 / 5
    result = []
    result.append("var impressions = [");
    length = len(possible_domains) - 1
    for i in range(0, 500):
        line_array = []
        line_array.append(format(possible_domains[randint(0, length)]))
        line_array.append(format(possible_domains[randint(0, length)]))
        line_array.append(format(str(randint(100, 1000))))
        line = "[" + ", ".join(line_array) + "],"
        result.append(line);
    result.append("];");

    output = open("results.js", "w");
    output.write("\n".join(result));

if __name__ == "__main__":
  new_data()
