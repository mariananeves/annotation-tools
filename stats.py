
import os

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
	tools = {}
	for filename in os.listdir(toolsDir):
		#print(filename)
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
#			print(feature,value)
		tools[filename] = tool
#	print(len(tools))
	return tools

def load_criteria():
	f = open(os.path.join('.','schema'), "r")
	criteria = []
	for line in f:
		if not line.startswith('#'):
			(feature,value) = line.split(':')
			criteria.append(feature)
	return criteria

if __name__ == '__main__':
	stats()

