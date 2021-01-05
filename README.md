# MV Basic Linkar VS Code Extension

[![Badge for version for Visual Studio Code extension KosdaySolutions.mvbasiclinkar](https://vsmarketplacebadge.apphb.com/version/KosdaySolutions.mvbasiclinkar.svg)](https://marketplace.visualstudio.com/items?itemName=KosdaySolutions.mvbasiclinkar)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<p align="center">
  <img height="200" src="https://www.kosday.com/vscodeimages/linkar.png" alt="MV Basic Linkar" title="MV Basic Linkar">
</p>

This [Visual Studio Code](https://code.visualstudio.com/) extension is used for syntax highlighting, IntelliSense and program formating for PickBasic code development. We hope this project sparks a sense of community involvement and action within the MultiValue and Pick Database space and if that is exciting to you, we'd love to have you help out! Please see our [Contribution Guidelines](https://github.com/mvextensions/.github/blob/master/CONTRIBUTING.md) and [Code of Conduct](https://github.com/mvextensions/.github/blob/master/CODE_OF_CONDUCT.md) for more information.

## Purpose of this guide

This document describes how to install and use the MV Basic Linkar extension in a MultiValue Development Environment. For purposes of this guide:
* MV refers to Pick-style MultiValue application and database environments
* VS Code refers to Microsoft Visual Studio Code
* Linkar refers to the Linkar Suite application
	* Linkar Server.
	* Linkar Manager.
	* Linkar REST API.
* MV Basic Linkar refers to the Linkar Visual Studio Code extension.

## Content table

- [Purpose of this guide](#Purpose-of-this-guide)
- [Content table](#Content-table)
- [1. Introduction](#1-introduction)
- [2. Prerequisites](#2-prerequisites)
- [3. Installing VS Code](#3-installing-vs-code)
- [4. Installing MV Basic Linkar extension](#4-installing-mv-basic-linkar-extension)
- [5. Creating connections](#5-creating-connections)
- [6. Using connections](#6-using-connections)
- [7. Working with file dictionaries](#7-working-with-file-dictionaries)
- [8. MV Developer Features](#8-mv-developer-features)
- [9. MV Basic Linkar Shortcut keys](#9-mv-basic-linkar-shortcut-keys)

## 1. Introduction

VS Code is a free, open source, feature rich, IDE that allows programmers to develop and debug code in various languages. There is also a community of developers that have developed extensions that provide functionality for VS Code that isn't built into the main program.

The MV Basic Linkar extension provides developers to gain the features of VS Code with MV BASIC programs. This extension provides connectivity to your MultiValue database.You can connect with any MultiValue database that Linkar supports, by now D3, jBase, mvBase,QM, Universe and Unidata.

The network architecture MV Basic Linkar needs to work is:

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/mvbasiclinkar_architecture.jpg" alt="MV Basic Linkar architecture" title="MV Basic Linkar architecture">
</p>

This extension includes the following features:
* Multiple simultaneous connections with different accounts and different databases in the same VS Code instance.
* Session pooling with the database (you can share database lines between your programmers)
* Optimistic locking in a multiuser environment
* File view selection
* Allowed to Use any file type in the MV database, including DIR, OSFI, Type19, etc.
* Use all data files under each dictionary file.
* Compile and catalog BASIC programs
* Run any TCL command
* Define compile and catalog options for each defined connection
* Run a terminal connection within a window, or launch a separate terminal emulation application.
* Filter programs inside the file using MV lists in the database
* Create, View, and Modify dictionary definitions in a structured UI.
* Insert directly VM, SV and Text marks (@VM, @SM, @TM). 
* Code highlighting for MV BASIC Programs
* Intellisense for the MV BASIC Statements and Functions
* Code folding
* Code formatting
* Go to/Peek Definition. Automatically jump to and peek internal subroutines
* Go to/Peek Definition. Automatically peek/load CALL, CHAIN and INCLUDE routines, even when they are in a different file.
* Syntax checking for GOTO,GOSUB,LOOPS,CASE statements and IF THEN/ELSE END statements
* Find all References of a word in current program

VS Code is available on Windows, Linux and Mac OSX.

## 2. Prerequisites

The following environment is required in order to use the extension.

* Windows, Linux or Mac OSX machine.
* VS Code
* An understanding of Linkar terminology and configuration, and a working installation. (http://kosday.com/Manuals/en_WEB_LINKAR)
* Access from the machine to a Linkar REST API server with API keys (The Linkar REST API server can be in any Linux, Windows or macOS machine). Linkar version 2.1 and above.

It is not necessary to have a Linkar REST API key for each VS Code instance or developer. Just one Linkar Server is enough to support all programmers to all required systems. You need at least 1 Linkar PRO license (Linkar REST API does not work with LITE licenses) You can ask for an evaluation license on our web (https://kosday.com/free-trial/). 1 Linkar Pro license, with one on-demand defined connection to the database can serve all programmers, and using only 1 database license when required.

You can have as many Linkar REST API keys as you need, pointing to the same Profile/EntryPoint (MV Database/Account) or to different ones (different MV databases, different accounts, different developers, etc.) Kosday recommends having at least 1 PRO license for each EntryPoint you will use. For instance, if you have 3 Linkar REST API keys in the same EntryPoint (same MV database/ Account), usually 1 Linkar PRO license, with 1 on demand session defined in the EntryPoint should be enough, even when you can add more for better performance. But if you have 2 Linkar REST API keys, defined in 2 different EntryPoints (2 MV databases or 2 different accounts in the same database) you will have better performance using 2 Linkar PRO licenses with one on-demand database session in each one.

As always, you can configure the Linkar EntryPoints in many different ways to obtain the best performance. Each individual case will be different. Kosday can help with all Linkar details. Also, remember you can change the configuration in seconds, and many times even with the Linkar Server started.

Kosday also recommends that you install Linkar Suite in a different machine than the one you use with VS Code to develop. You can install it in Windows, Linux or macOS. The reason is that the architecture is designed to work with many developers, so the Linkar REST API server will be used by many people. Usually your development machine, where you run VS Code, is for one developer who can stop and start it at any time. It is preferable to install Linkar Suite in one of your organization servers so the Linkar REST API server will be running 24 hours a day / 7 days a week. This is not for resources; Linkar Suite can run even in a Raspberry Pi. It is much more a security matter. Imagine you have programmers working remotely or that you have contract programmers in any part of the world, you can give them access only to the machine that runs the Linkar REST API and in the TCP port defined for it, using a Linkar user with minimum privileges  in the API Key you generate for them. They can work with VS Code perfectly (the only limit will be the terminal access to the database for debugging.

## 3. Installing VS Code

VS Code can be downloaded from the following link: https://code.visualstudio.com/download

## 4. Installing MV Basic Linkar extension

The easiest way to use this extension is to download it from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=KosdaySolutions.mvbasiclinkar). Please be aware that VS Code may require a reload after installation or updating.

Start VS Code and select the Extensions Button. In the search box, type "linkar".

Select the MV Basic Linkar extension by clicking on the item in the list then choose install. Once the extension is installed we are ready to start using VS Code on your MV databases (source code files and data file dictionaries)

## 5. Creating connections

You can create as many connections as you need. MV Basic Linkar extension allows you to work with all of them simultaneously.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/002.jpg" alt="Edit Connection" title="Edit Connection">
</p>

**Connection name**: The name you want for this connection.

**Database type**: Type of the database (D3, jBase, mvBASE, QM, Universe, Unidata)

**Server**: URL of the Web Server of Linkar Suite where the Linkar REST API server is installed.

**Port**: TCP Port of the Web Server of Linkar Suite where the Linkar REST API server is installed (usually 11201).

**SSL**: You must activate this if Linkar is using SSL.

**API Key**: The API key you are going to use to connect to the database. Refer to https://kosday.com/linkar-rest-api-how-to/ to know how to create API Keys.

**Plugin Ref**: If this connection is going to be usedby a plugin, the Linkar plugin reference. Usually keep this empty.

**Custom Vars**: This is a free text field to send in the transaction. If not empty, subroutine SUB.LK.MAIN.CONTROL.CUSTOM will be called. Add custom code to that subroutine to define special behaviors for some or all transactions.

**Free Text**: A free text that you can include to identify this connection in the Linkar Manager or to use in the SUB.LK.MAIN.CONTROL.CUSTOM subroutine.

**Language**: If languages other than English are defined for use with Linkar, you can use the Linkar Schemas language definition.

**Load automatically on start**: The Connection will be loaded when you start VS Code.

**Included files**: The program files you want to load in this connection. If you leave this empty, all the files from the account will be loaded. You must separate the files with "|" (pipe). We recommend specifying the files here in order to have better performance and more security, only giving programmers access to the files they need. You can change the file list at any time, and just reload the connection.

**Max. records per file**: The maximum number of records per file allowed in download. This parameter is included as security against the possible existence of files with many records, which can slow down the load.

**BASIC command**: The TCL command you use to compile your programs, usually BASIC or COMPILE but you can use your own if you have a precompiler in the database.

**BASIC arguments**: Arguments for the BASIC command. For instance, if you want to compile with Flash BASIC in D3 you will put "(O".

**CATALOG command**: The TCL command you use to catalog programs in the database.

**CATALOG arguments**: Arguments for the TCL command, for instance "LOCAL", "GLOBAL", "(G", etc.

**Custom Terminal Emulation Command**: OS command to start an emulator (Accuterm, Putty, Telnet, SSH...) in the machine where VS Code is running. Depending on the command you use it will run in a new Window or inside the VS Code terminal window. For instance ssh@mydatabaseip will start an SSH connection with the database inside the VS Code terminal window, telnet mydatabase 4242 will start a Telnet connection with a QM database inside the VS Code terminal, "C:\Program Files (x86)\atwin80\atwin80.exe" will start Accuterm in a new window. All these connections will use a new database license when connected. If you want to use “telnet.exe” or “ssh.exe” in Windows you must activate them (in W10 they are deactivated by default). Refer to https://social.technet.microsoft.com/wiki/contents/articles/910.windows-7-enabling-telnet-client.aspx or https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse

## 6. Using connections

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/003.jpg" alt="Connection buttons" title="Connection buttons">
</p>

**New Connection**: Create a new connection.

**Collapse all the Linkar explorer tree**: Collapse all the tree, connections, files and programs.

**Dictionaries Management**:Opens a text box to write the filename. Then you can see, create, delete, update the file dictionaries.

**Execute TCL Command**: Opens a textbox to write the TCL command and then execute it in the database. The result appears in the output tab of the Vs Code Terminal.

**WARNING!!** Do not use this resource to test programs, if the TCL Command execution crashes all the EntryPoint line will crash, and you and the rest of team may lose all connections.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/004.jpg" alt="TCL Command" title="TCL Command">
</p>

**Open custom terminal**: Opens a telnet or SSH session with the database. It can be used for debugging purpose inside the VS Code environment (it uses a database line).

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/005.jpg" alt="Custom terminal" title="Custom terminal">
</p>

**Delete connection**: Delete the connection.

**Edit connection**: Edit the connection to change the preferences. You can add files, etc.

**Unload connection**: Unload all the files of that connection.

**Load connections**: Load all the files of that connection.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/006.jpg" alt="Load connections" title="Load connections">
</p>

**If you right click the mouse in the code:**

**Insert Value Mark**: Insert a char(253) character , @VM, in the BASIC Code.

**Insert SubValue Mark**: Insert a char(252) character, @SV, in the BASIC Code.

**Insert Text Mark**: Insert a char(251) character in the BASIC Code.

**Write-BASIC**: Save and compile the BASIC Code. The result appears in the output tab of the VS Code terminal.

**Write-BASIC-Catalog Program**: Save, compile and catalog the BASIC Code. The result appears in the output tab of the VS Code terminal.

**BASIC Program**: Compile the BASIC Code. The result appears in the output tab of the VS Code terminal.

**Catalog Program**: Catalog the program. The result appears in the output tab of the VS Code terminal.

**Save as**: Save the BASIC code with a new name.

**Delete Item**: Delete the program or subroutine.

**Command Palette**: Open the VS Code box commands palette. If you write the word Linkar in the box you will see all the MV BASIC Linkar extension commands.

**File tree options:**

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/007.jpg" alt="File tree options" title="File tree options">
</p>

**Open saved list**: Open all items in a MV database previous saved list.

**New Item**: Create a new program or subroutine in the selected file.

**Refresh file**: Refresh the list of items in the file.

**Dictionary Management**: You can see, create, delete, update the file dictionaries.

**Item record options (program or subroutine)**

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/008.jpg" alt="Item record options" title="Item record options">
</p>

**Delete Item**: Delete the program or subroutine.

**Rename Item**:Rename the program or subroutine.

**Save as Item**: Save the BASIC code with a new name.

## 7. Working with file dictionaries

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/009.jpg" alt="Open file dictionaries" title="Open file dictionaries">
</p>

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/010.jpg" alt="QM Dictionaries" title="QM Dictionaries">
</p>

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/011.jpg" alt="Item record options" title="D3 Dictionaries">
</p>

**Dictionaries**: List of all dictionaries in the file. 

**Delete Dicts**:  Delete the dictionary item. You must click on the delete icon and later click on Save Changes to delete all the dictionary items you have mark for delete. 

**New Dict**: Create a new dictionary in the file. 

**Generate Equates**: Generate equates with all the dictionary items in the file so you can copy/paste them in your source code. 

**Save changes**: Save all new dictionary items and changes in the database. 

**Discard Changes**: Discard all changes and new dictionary items. 

## 8. MV Developer Features

The following is a list of features that the extensions offer MV Developers when using VS Code.

**Syntax**

Code is highlighted based on the current theme selected for VS Code.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/012.jpg" alt="Syntax" title="Syntax">
</p>

**Intellisense**

As you type your program, you will be prompted with available statements and functions including the syntax and description.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/013.jpg" alt="Intellisense" title="Intellisense">
</p>

Note that syntax highlighting and other code matching are not yet dynamically linked to this selection but that update will be forthcoming.

**Find All References**

You can find all references to a word in your program by **right clicking** on a word and selecting *Find All References* from the menu.

The display consists of two panels, the right containing the line that the word is in and the actual code block is in the left. Clicking on a line in the right panel will take you to the code block.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/014.jpg" alt="Find All References" title="Find All References">
</p>

**Goto/Peek Definition**

If you **right click** on a internal or external subroutine name and select *Peek Definition*, a window appears showing the internal or external subroutine.

If you select *Go to Definition* , the cursor is moved to start of the subroutine.

If the subroutine is not in the same file, a text list will appear to choose the file that has the subroutine.

<p align="center">
  <img src="https://www.kosday.com/vscodeimages/015.jpg" alt="Goto/Peek Definition" title="Goto/Peek Definition">
</p>

**Internal Subroutine lookup**

Pressing Ctl+Space after the words *GOTO*, *GOSUB* or *GO TO*, will allow you to select from defined internal subroutines in your program.

## 9. MV Basic Linkar Shortcut keys

| KEYS          | EFFECT        |
| ------------- |---------------|
| ALT+A + ALT+V | Insert char(253) character, @VM |
| ALT+A + ALT+S | Insert char(252) character, @SV      |
| ALT+A + ALT+T | Insert char(251) character, @TM      |
| ALT+S + ALT+B | Save and compile the code record      |
| ALT+S + ALT+C | Save, compile and catalogue the code record      |
| ALT+A + ALT+B | Compile the code record |
| ALT+A + ALT+C | Catalog the code record      |

## Licence

### [Licence](https://kosday.com/terms/) Copyright (c) 2020 MVExtensions Group

MIT License Permission is here by granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

All other trademarks and service marks are property of their respective holders.

This extension uses code created in the MVBasic VSCode Extension:

MV Basic Linkar includes code of the MvBasic Language module. It includes colors, intellisense, peek, references, etc.

Actually MV Basic Linkar has included the original code, so you do not need to install the MVBasic extension.

https://marketplace.visualstudio.com/items?itemName=mvextensions.mvbasic

https://github.com/mvextensions/mvbasic/blob/master/doc/Extension%20Guide.md#visual-studio-code-multivalue-extension


