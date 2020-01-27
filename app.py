
import os

from flask import Flask, render_template, request, flash

from flask_bootstrap import Bootstrap

from flask_wtf import FlaskForm
from wtforms import SubmitField, BooleanField, SelectField, TextAreaField, IntegerField
from wtforms.validators import DataRequired, NumberRange, Length, Optional, InputRequired

from searchtools import search

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'hard to guess string'
bootstrap = Bootstrap()
bootstrap.init_app(app)

@app.route('/', methods=['GET', 'POST'])
def index():
	form = SearchForm()
	if request.method=='POST':
		print(form.data)
		if form.validate_on_submit():
			arguments = Arguments()
			arguments.available=form.available.data
			arguments.type = form.type_install.data
			arguments.installable = form.installable.data
			arguments.workable = form.workable.data
			arguments.schematic = form.schematic.data
			# publication
			arguments.last_publication = form.last_publication.data
			arguments.citations = form.citations.data
			arguments.citations_corpora = form.citations_corpora.data
			# technical
			arguments.last_version = form.last_version.data
			arguments.source_code = form.source_code.data
			arguments.online_available = form.online_available.data
			arguments.installation = form.installation.data
			arguments.documentation = form.documentation.data
			arguments.free = form.free.data
			arguments.license = form.license.data
			# data		
			arguments.format_schema = form.format_schema.data
			arguments.format_documents = form.format_documents.data
			arguments.format_annotations = form.format_annotations.data
			# functional
			arguments.multi_label = form.multi_label.data
			arguments.document_level = form.document_level.data
			arguments.relationships = form.relationships.data
			arguments.ontologies = form.ontologies.data
			arguments.preannotations = form.preannotations.data
			arguments.medline_pmc = form.medline_pmc.data
			arguments.full_texts = form.full_texts.data
			arguments.partial_save = form.partial_save.data
			arguments.highlight = form.highlight.data
			arguments.users_teams = form.users_teams.data
			arguments.iaa = form.iaa.data
			arguments.data_privacy = form.data_privacy.data
			arguments.multilingual = form.multilingual.data
			print(arguments)
			arr_output = search(arguments)
			print(len(arr_output))
			return render_template('annotationsaurus.html', form=form, arr_output=arr_output)
		else:
			flash(form.errors)
	return render_template('annotationsaurus.html', form=form)

@app.route('/about')
def about():
	return render_template('about.html')

@app.errorhandler(404)
def page_not_found(e):
	return render_template('404.html'),404

@app.errorhandler(500)
def internal_server_error(e):
	return render_template('500.html'),500

class SearchForm(FlaskForm):
	# requirements
	available = BooleanField('available', validators=[])
	type_install = SelectField('type tool', choices=[('', ''), ('web-based', 'web-based'), ('stand-alone', 'stand-alone'), ('plug-in', 'plug-in')])
	installable = BooleanField('installable', validators=[])
	workable = BooleanField('workable', validators=[])
	schematic = BooleanField('schematic', validators=[])
	# publications
	last_publication = IntegerField('last publication:', validators=[Optional(),NumberRange(min=1900,max=2100)], render_kw={'maxlength': 4})
	citations = IntegerField('citations:', validators=[Optional(),NumberRange(0,1000)], render_kw={'maxlength': 4})
	citations_corpora = IntegerField('citations corpora:', validators=[Optional(),NumberRange(0,1000)], render_kw={'maxlength': 4})
	# technical
	last_version = IntegerField('last version:', validators=[Optional(),NumberRange(min=1900,max=2100)], render_kw={'maxlength': 4})
	source_code = BooleanField('source code', validators=[])
	online_available = BooleanField('online available', validators=[])
	installation = SelectField('installation', choices=[('', ''), ('easy', 'easy'), ('medium', 'medium'), ('hard', 'hard')])
	documentation = SelectField('documentation', choices=[('', ''), ('good', 'good'), ('poor', 'poor'), ('none', 'none')])
	free = SelectField('free', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	license = SelectField('license', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('none', 'none')])
	# data format
	format_schema = SelectField('format schema', choices=[('', ''), ('XML', 'XML'), ('JSON', 'JSON'), ('GUI', 'GUI'), ('other', 'other')])
	format_documents = SelectField('format documents', choices=[('', ''), ('XML', 'XML'), ('JSON', 'JSON'), ('TXT', 'TXT'), ('other', 'other')])
	format_annotations = SelectField('format annotations', choices=[('', ''), ('XML', 'XML'), ('JSON', 'JSON'), ('TXT', 'TXT'), ('other', 'other')])
	# functional
	multi_label = BooleanField('multi_label', validators=[])
	document_level = SelectField('document level', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	relationships = SelectField('relationships', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	ontologies = BooleanField('ontologies', validators=[])
	preannotations = SelectField('preannotations', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	medline_pmc = SelectField('medline/pmc', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	full_texts = SelectField('full texts', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	partial_save = SelectField('partial save', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	highlight = BooleanField('highlight', validators=[])
	users_teams = SelectField('users/teams', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	iaa = SelectField('iaa', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	data_privacy = BooleanField('data privacy', validators=[])
	multilingual = SelectField('multilingual', choices=[('', ''), ('yes', 'yes'), ('partial', 'partial'), ('no', 'no')])
	submit = SubmitField('Submit')

class Arguments():
	def __init__(self):
		self.available = ""
		self.type = ""
		self.installable = ""
		self.workable = ""
		self.schematic = ""
		# publication
		self.last_publication = ""
		self.citations = ""
		self.citations_corpora = ""
		# technical
		self.last_version = ""
		self.source_code = ""
		self.online_available = ""
		self.installation = ""
		self.documentation = ""
		self.free = ""
		self.license = ""
		# data		
		self.format_schema = ""
		self.format_documents = ""
		self.format_annotations = ""
		# functional
		self.multi_label = ""
		self.document_level = ""
		self.relationships = ""
		self.ontologies = ""
		self.preannotations = ""
		self.medline_pmc = ""
		self.full_texts = ""
		self.partial_save = ""
		self.highlight = ""
		self.users_teams = ""
		self.iaa = ""
		self.data_privacy = ""
		self.multilingual = ""
		


