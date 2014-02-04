#!/usr/bin/python
#
# convert .po to .js
#

import json
import optparse
import os
import polib
import re
import string
import sys

parser = optparse.OptionParser(usage="usage: %prog [options] pofile...")
parser.add_option("--callback", default="_.setTranslation", dest="callback", help="callback function to call with data")
parser.add_option("--quiet", action="store_false", default=True, dest="verbose", help="don't print status messages to stdout")

(options, args) = parser.parse_args()

if args == None or len(args) == 0:
	print("ERROR: you must specify at least one po file to translate");
	sys.exit(1)

paramFix = re.compile("(\\(([0-9])\\))")

for srcfile in args:

	destfile = os.path.splitext(srcfile)[0] + ".js"
	if options.verbose:
		print("INFO: converting %s to %s" % (srcfile, destfile))
	
	xlate_map = {}
	
	po = polib.pofile(srcfile, autodetect_encoding=False, encoding="utf-8", wrapwidth=-1)
	for entry in po:
		if entry.obsolete or entry.msgstr == '' or entry.msgstr == entry.msgid:
			continue
			
		xlate_map[entry.msgid] = entry.msgstr;
			
	dest = open(destfile, "w")
	
	dest.write(options.callback);
	dest.write("(");
	
	encoder = json.JSONEncoder()
	
	for part in encoder.iterencode(xlate_map):
		if part.startswith('"function('):
			dest.write(part[1:-1]);
		else:
			dest.write(part);
	
	dest.write(");\n")
	
	dest.close()

 
