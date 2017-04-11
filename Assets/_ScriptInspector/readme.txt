Script Inspector
version 1.3.1, August 2012
Copyright © 2012, Flipbook Games
--------------------------------


Bugs fixed in 1.3.1:
- Opening hyperlinks from code view

New in Script Inspector v1.3:
- Search functionality
- All hyperlinks accessible from toolbar
- More compact UI
- Faster parsing

New in Script Inspector v1.2:
- Line numbers (optional)
- Opening at a specific line
- Fixed a Tab-expansion bug
- More optimization


1. Description

Script Inspector is a Unity3D Editor Extension which shows the content of script assets inside the Inspector window in a more readable format than Unity's built-in inspector, using syntax highlighting similar to modern programming IDE applications. The URL and email addresses found inside comments are converted to hyperlinks which makes it easy to follow them with a single mouse-click operation. It also offers search functionality with search results highlighting.


2. Motivation

Unity's default inspector is displaying all scripts same as they were just a plain text file. This is certainly better than nothing, but still quite far from anything useful because:

a) The content is displayed using variable width font with word wrapping which breaks the code formatting and makes it difficult to read!

b) There is no syntax highlighting which makes it even more difficult to read!

c) The content of longer scripts is truncated which makes the rest of their content impossible to read!

d) URL and email addresses often found in comment sections of scripts pointing to documentation pages or contacts for support cannot be followed by clicking on them, and cannot be even copy-pasted into another application, so users have to remember the whole address and then type it somewhere else!

e) It all looks just like plain text which makes it difficult to recognize its content as code, so programmers may pay more attention while non-programmers may decide to ignore it.

Script Inspector solves all those issues!


3. How to use the Script Inspector

Whenever a C#, JavaScript, or a Boo script is selected from the Project window, the Inspector window displays the whole content of the script in a way typical for viewing code files, i.e. using a mono-spaced font with syntax highlighting, no word-wrapping, proper tab expansion and alignment, and with underlined hyperlinks for single-click navigation.

You can search for a text though the script file using the search field in the toolbar. Search results get immediately highlighted as you type. Easily navigate to the next or previous result using the up and down arrow keys or using the up and down buttons shown inside the search field.

All hyperlinks found in the comments of the script will be shown in the Links drop-down toolbar button so you can easily open any of them directly from there and without even looking through the code.

Different syntax highlighting color schemes can be selected from the wrench button located on the toolbar right above the code view. Current version supports four different color schemes:

- Visual Studio, similar to default scheme in Visual Studio
- Xcode, similar to default scheme in Xcode
- Tango Light, similar to TangoLight theme in Monodevelop
- Tango Dark (Oblivion), similar to Oblivion theme in Monodevelop

Line numbers will be shown by default. This feature can be turned off from the wrench button menu. Clicking a line number opens the selected line in the external source code editor.

The About box can also be accessed through the wrench button menu.


4. Support, Bugs, Requests, and Feedback

Please feel free to contact Flipbook Games at info@flipbookgames.com or visit us at http://flipbookgames.com



Thanks for purchasing it!
