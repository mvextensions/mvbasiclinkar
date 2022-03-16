# Changelog

## 1.0.0

- Initial release of the MV Basic Linkar extension under the Kosday Solutions project

## 1.0.1

- Hide internal commands from command pallete

## 1.0.2

- Added Reality support
- Preserve focus when execute TCL command, compile or catalog

## 1.0.3

- Added method Search Items (button in tree, alt+A+F or cmd+A+F)
    Searches all open Linkar connections for item names matching the text to be searched. You will be able to open the chosen items.
- Added method View Recent Opened Items (button in tree, alt+A+H or cmd+A+H)
    View the last 50  opened items in any connection.
- Added method Clear History recent opened items (alt+A+D or cmd+A+D)
    Clear the Linkar history records
- Added Export button in Dictionaries
    Displays a table of all the dictionaries that can be exported to TXT or HTML.
- Save As method
    Now it can also be saved in another file or on another file on another open connection.

## 1.0.4

- Added new feature: Now you can have the program files on a saved list in the database and use it from vscode using GET.LIST clause
- Bug fixed in Universe by selecting all files

## 1.0.5

- Added feature in VsCode optimistic locking checking also with the MV Database actual record

## 1.0.6

- Fixed a bug in the Rename item method with the new Linkar versions
- "Ignore Identation In Comments" setting added. Allow ignore the indentation of comments by always leaving them at the beginning of the line (Warning: this causes the vscode functionality of collapsing or expanding code regions to malfunction since it is based on indentation) 
- Fixed a bug when formatting certain combinations of LOOP/UNTIL/REPEAT instructions.
- Changes in the reference search, now detects better the word to search correcting some erroneous searches.

## 1.0.7

- Fixed Bug with the XMLHttpRequest library as of VSCode version 1.62.1. To install this version or later you must have VSCode 1.62.1 or higher installed.

## 1.0.8

- Applied the same fix as in 1.0.7 to commands that are too large.

## 1.0.9

- Bug fixed when selecting all files in Universe.
