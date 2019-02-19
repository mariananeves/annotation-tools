
import argumentparser
import os

def main():
	args = argumentparser.ArgumentParser()
	search(args)

def search(args):
	# load tools
	tools = loadTools()
	print('tools loaded...',len(tools))
	# load filters
	filters = loadFilters(args)
	print('filters loaded...',len(filters))
	# filter tools
	results = {}
	for name, tool in tools.items():
		matches = 0
		info = ''
		for arg in filters:
			#print(tool[arg],filters[arg])
			if arg in tool and tool[arg] is not None:
				is_match = False
				print(name,tool[arg])
				if arg in {'last_publication','citations','citations_corpora','last_version'} and int(tool[arg])>=filters[arg]:
					is_match = True
				else:
					if tool[arg]==filters[arg]:
						is_match = True
				if is_match:
					matches += 1
					info += arg+'='+tool[arg]+' '
		if matches>0:
			tool['info'] = info
			tool['matches'] = matches
			results[name] = tool
	# print results
	arr_output = []
	print('\n*** RESULTS ***')
	#print(len(results))
	if len(results)==0:
		print('No matches found!')
	for total in range(len(filters),0,-1):
		#print(total)
		for name, result in results.items():
			#print(result['matches'])
			if result['matches']==total:
				print(result['matches'],name,result['info'])
				output_elem = {}
				output_elem['matches'] = result['matches']
				output_elem['info'] = result['info']
				output_elem['name'] = name
				arr_output.append(output_elem)
	return arr_output

def loadFilters(args):
	#print(args)
	filters = {}
	for arg in vars(args):
		value =  getattr(args, arg)
		if value is not None:
			if value is True:
				value='yes'
			if value is False:
				value='no'
			if value!='no':
				print(arg, value)
				filters[arg] = value
	return filters

def loadTools():
	toolsDir = './tools/'
	tools = {}
	for filename in os.listdir(toolsDir):
		print(filename)
		f = open(os.path.join(toolsDir,filename), "r")
		tool = {}
		for line in f:
			if not line.startswith('#'):
				(feature,value) = line.split(':')
				tool[feature] = value.rstrip()
				#print(feature,value)
		tools[filename] = tool
	#print(len(tools))
	return tools

if __name__ == '__main__':
    main()

