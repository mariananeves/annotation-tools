
import os
from pprint import pprint
import re

def stats():
	tools = load_tools()
	criteria = load_criteria()
	# stats criteria
#	stats_criteria = {}
	print('** Stats criteria:')
	for criterion in criteria:
		total = 0
		for name, tool in tools.items():
#			print(tool)
			if criterion in tool and tool[criterion] is not None:
				total += 1
#		stats_criteria[criterion] = total
		print(criterion+'\t'+str(total))
	# stats tools
	print('** Stats tools:')
	for name, tool in tools.items():
		total = len(tool.keys())
#		print(tool)
		print(name+'\t'+str(total))
		for key in tool.keys():
			if key not in criteria:
				print('--> Wrong criteria names in tools:'+name+'\t'+key)

def load_tools():
	toolsDir = './tools/'
	parsed_readme = parse_readme()
	tools = {}
	for filename in os.listdir(toolsDir):
		f = open(os.path.join(toolsDir,filename), "r")
		tool = {}
		for line in f:
			if line.startswith('#'):
				continue
			if ':' not in line:
				continue
			#print(line)
			(feature,value) = line.split(':')
			tool[feature] = value.rstrip()
		tools[filename] = tool

		for item in ['paper', 'url']:
			try:
				tools[filename][item] =parsed_readme[filename.strip()][item]
			except KeyError as e:
				print(e)
				tools[filename][item] = False
	return tools

def parse_readme():
	fp = open(os.path.join('.','README.md'), "r")
	data = fp.read()
	data.split('List of annotation tools (in alphabetical order):\n')
	content = [x for x in data.split('| ---- | ---- | ---- |\n')[1].splitlines( ) if x]
	tmp_dict = {}
	for row in content:
		tmp_row = [x.strip() for x in row.split('|') if x]
		try:
			paper_url = re.findall('\((.*?)\)', tmp_row[1])[0]
		except IndexError:
			# paper_url = 'Not available'
			paper_url = False
		try:
			tool_url = re.findall('\((.*?)\)', tmp_row[2])[0]
		except IndexError:
			# tool_url = 'Not available'
			tool_url = False
		tmp_dict[tmp_row[0].strip()]=dict(paper=paper_url, url=tool_url)
	return tmp_dict

def load_criteria():

	hide_criteria = ['#publication', '#name']
	hide_subcriteria = ['last_version']

	f = open(os.path.join('.','schema'), "r")
	criteria = {}
	category = None
	for line in f:
		if line.startswith('#'):
			category = line.strip()
			criteria[category]={}
		else:
			(feature, value) = line.rstrip().split(':')
			if feature not in hide_subcriteria:
				criteria[category][feature]=value.split(',')

	for hide in hide_criteria:
		del criteria[hide]

	filters = {k1:False for k,v in criteria.items() for k1, v1 in v.items()}
		
	pprint(criteria)
	pprint(filters)

	return criteria


if __name__ == '__main__':
	stats()

