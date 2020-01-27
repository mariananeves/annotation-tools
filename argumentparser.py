
import argparse

def ArgumentParser():
    parser = argparse.ArgumentParser()
    # requirements
    parser.add_argument('--available', action='store_true', #type=str, choices=['yes','no'], #default='yes', 
                        help='whether the tool is available to use or download')
    parser.add_argument('--type', type=str, choices=['web-based','stand-alone','plug-in'], #default='web-based',
                        help='type of installation: web-based, stand-alone or plug-in')
    parser.add_argument('--installable', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool could be installed')
    parser.add_argument('--workable', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool worked')
    parser.add_argument('--schematic', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool allows to configure an annotation schema')
    # criteria: publication
    parser.add_argument('--last_publication', type=int, #default='2013',
                        help='the minimum year for the last publication of the tool')
    parser.add_argument('--citations', type=int, #default='30',
                        help='the minimum number of citations that the publications of the tools should have')
    parser.add_argument('--citations_corpora', type=int, #default='10',
                        help='the minimum number of citations for corpus construction that the publications of the tools should have')
    # criteria: technical
    parser.add_argument('--last_version', type=int, #default='2017',
                        help='the minimum year for the last version of the tool')
    parser.add_argument('--source_code', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the source code of the tool is available')
    parser.add_argument('--online_available', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether there is an online version of tool available for use')
    parser.add_argument('--installation', type=str, choices=['easy','medium','hard'], #default='easy',
                        help='Easiness of installation of the tool: easy, medium or hard')
    parser.add_argument('--documentation', type=str, choices=['good','poor','none'], #default='good',
                        help='Quality of the documentation of the tool: good, poor or none')
    parser.add_argument('--license', type=str, choices=['yes','partial','none'], #default='good',
                        help='License of the tool')
    parser.add_argument('--free', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool is free')
    # criteria: data format
    parser.add_argument('--format_schema', type=str, choices=['XML','JSON','GUI','other'], #default='',
                        help='Format of the schema: XML, JSON, GUI or other')
    parser.add_argument('--format_documents', type=str, choices=['XML','JSON','TXT','other'], #default='',
                        help='Format for the input/output of the documents: XML, JSON, TXT or other')
    parser.add_argument('--format_annotations', type=str, choices=['XML','JSON','TXT','other'], #default='',
                        help='Format for the input/output of the annotations: XML, JSON, GUI or other')
    # criteria: functional
    parser.add_argument('--multilabel', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool allows annotations with multiple labels')
    parser.add_argument('--document_level', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool allows annotations on document level')
    parser.add_argument('--relationships', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool allows annotations for relationships: yes, partial or no')
    parser.add_argument('--ontologies', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool allows the use of ontologies for the annotation')
    parser.add_argument('--preannotations', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool supports pre-annotations')
    parser.add_argument('--medline_pmc', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool supports integration with either Medline or PMC')
    parser.add_argument('--full_texts', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool supports the annotation of full texts')
    parser.add_argument('--partial_save', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool supports saving annotations partially')
    parser.add_argument('--highlight', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool supports highlighting text spans')
    parser.add_argument('--users_teams', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool supports users and teams')
    parser.add_argument('--iaa', action='store_true', #type=str, choices=['yes','no'], #default='yes',
                        help='whether the tool supports inter-annotator agreement')
    parser.add_argument('--data_privacy', action='store_true', #type=str, choices=['yes','no'], #default='no',
                        help='whether the tool can be used with private data')
    parser.add_argument('--multilingual', type=str, choices=['yes','partial','no'], #default='yes',
                        help='whether the tool supports multiple languages')
    return parser.parse_args()

