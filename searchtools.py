
import argumentparser
import os

from stats import load_tools

def main():
	args = argumentparser.ArgumentParser()
	search(args)

def search(args):
	# load tools
	tools = load_tools()
	print('tools loaded...',len(tools))
	# load filters
	filters = load_filters(args)
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
				if arg in {'last-publication','citations','citations_corpora','last-version'} and int(tool[arg])>=filters[arg]:
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

def load_filters(args):
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

if __name__ == '__main__':
    main()

