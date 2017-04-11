/* SCRIPT INSPECTOR for Unity3D
 * version 1.3.1, August 2012
 * Copyright © 2012, by Flipbook Games
 * 
 * Custom Inspector for C#, JavaScript and Boo scripts
 * 
 * Bugs fixed in 1.3.1:
 * - Opening hyperlinks from code view
 * 
 * New Features in 1.3:
 * - Search functionality
 * - All hyperlinks accessible from toolbar
 * - More compact UI
 * - Faster parsing
 * 
 * New Features in 1.2:
 * - Line numbers (optional)
 * - Open at line functionality
 * 
 * New Features in 1.1:
 * - Progresive processing of very long files
 * 
 * Initial Release Features:
 * - Fast source code syntax analysis of C#, JavaScript and Boo scripts
 * - Single-click opening of URL and email addresses found in comments
 * - Shows the whole content of a script
 * - Four built-in color schemes
 * - Optimized rendering for smooth and responsive GUI
 * - Full source code provided for your reference or modification
 * 
 * Visit http://flipbookgames.com/ for more info.
 * 
 * Contact info@flipbookgames.com for feedback, bug reports, or suggestions.
 */

using UnityEngine;
using UnityEditor;
using System;
using System.Text.RegularExpressions;
using FlipbookGames;
using System.IO;
using System.Text;
using System.Collections.Generic;

[CustomEditor(typeof(MonoScript))]
public class ScriptInspector : Editor
{
	public static string GetVersionString()
	{
		return "1.3.1, August 2012";
	}

	private static string[] availableThemes = new string[]
	{
		"Visual Studio",
		"Xcode",
		"Tango Dark (Oblivion)",
		"Tango Light",
	};

	private class Theme
	{
		public Color background;
		public Color text;
		public Color comments;
		public Color strings;
		public Color keywords;
		public Color knownTypes;
		public Color hyperlinks;
		public Color lineNumbers;
		public Color lineNumbersHighlight;
		public Color lineNumbersBackground;
		public Color fold;
		public Color searchResults;
	}
	private static Theme[] themes = new Theme[] {
		// Visual Studio
		new Theme {
			background				= Color.white,
			text					= Color.black,
			comments				= new Color32(0x00, 0x80, 0x00, 0xff),
			strings					= new Color32(0x80, 0x00, 0x00, 0xff),
			keywords				= Color.blue,
			knownTypes				= new Color32(0x2b, 0x91, 0xaf, 0xff),
			hyperlinks				= Color.blue,
			lineNumbers				= new Color32(0x2b, 0x91, 0xaf, 0xff),
			lineNumbersHighlight	= Color.blue,
			lineNumbersBackground	= Color.white,
			fold					= new Color32(165, 165, 165, 255),
			searchResults			= Color.yellow
		},
		
		// Xcode
		new Theme {
			background				= Color.white,
			text					= Color.black,
			comments				= new Color32(0x23, 0x97, 0x2d, 0xff),
			strings					= new Color32(0xce, 0x2f, 0x30, 0xff),
			keywords				= new Color32(0xc1, 0x2d, 0xad, 0xff),
			knownTypes				= new Color32(0x80, 0x46, 0xb0, 0xff),
			hyperlinks				= new Color32(0x50, 0x6f, 0x73, 0xff),
			lineNumbers				= new Color32(0x6c, 0x6c, 0x6c, 0xff),
			lineNumbersHighlight	= Color.black,
			lineNumbersBackground	= Color.white,
			fold					= TangoColors.aluminium3,
			searchResults			= Color.yellow
		},
		
		// Tango Dark (Oblivion)
		new Theme {
			background				= TangoColors.aluminium6,
			text					= TangoColors.aluminium2,
			comments				= TangoColors.aluminium4,
			strings					= TangoColors.butter2,
			keywords				= TangoColors.plum1,
			knownTypes				= TangoColors.chameleon1,
			hyperlinks				= TangoColors.butter2,
			lineNumbers				= TangoColors.aluminium5,
			lineNumbersHighlight	= TangoColors.aluminium3,
			lineNumbersBackground	= TangoColors.aluminium7,
			fold					= TangoColors.aluminium3,
			searchResults			= TangoColors.skyblue3
		},
		
		// Tango Light
		new Theme {
			background				= Color.white,
			text					= TangoColors.aluminium7,
			comments				= TangoColors.chameleon3,
			strings					= TangoColors.plum2,
			keywords				= TangoColors.skyblue3,
			knownTypes				= TangoColors.chameleon3,
			hyperlinks				= Color.blue,
			lineNumbers				= TangoColors.aluminium4,
			lineNumbersHighlight	= TangoColors.aluminium5,
			lineNumbersBackground	= Color.white,
			fold					= TangoColors.aluminium3,
			searchResults			= new Color32(0xff, 0xe2, 0xb9, 0xff)
		},
	};
	private static Theme currentTheme = themes[0];

	private static bool showLineNumbers = true;

	private class Styles
	{
		public GUIStyle scrollViewStyle;
		public GUIStyle normalStyle;
		public GUIStyle hyperlinkStyle;
		public GUIStyle mailtoStyle;
		public GUIStyle keywordStyle;
		public GUIStyle userTypeStyle;
		public GUIStyle commentStyle;
		public GUIStyle stringStyle;
		public GUIStyle lineNumbersStyle;

		public GUIStyle lineNumbersBackground;
		public GUIStyle lineNumbersSeparator;

		public GUIStyle searchResultStyle;
		public GUIStyle ping;

		public GUIStyle toolbarSearchField;
		public GUIStyle toolbarSearchFieldCancelButton;
		public GUIStyle toolbarSearchFieldCancelButtonEmpty;
		public GUIStyle upArrowStyle;
		public GUIStyle downArrowStyle;
	}
	private static Styles styles = new Styles();

	private Vector2 scrollPosition = new Vector2();

	private bool isJsFile = false;
	private bool isCsFile = false;
	private bool isBooFile = false;

	private struct TextBlock
	{
		public GUIStyle style;
		public string text;

		public TextBlock(string t, GUIStyle s)
		{
			style = s;
			text = t;
		}
	}

	private class FormatedLine
	{
		public TextBlock[] textBlocks;
	}
	private FormatedLine[] formatedLines;
	private List<string> lines;
	private string[] hyperlinks = null;
	private StreamReader streamReader;
	private int numParsedLines;
	private bool parsingBlockComment;
	private bool parsingBlockString;

	private float contentWidth = 0;
	[NonSerialized]
	private Rect scrollViewRect;
	[NonSerialized]
	private Rect contentRect;
	private bool needsRepaint = false;
	private Vector2 charSize;

	private static GUIContent lineNumberTooltip = new GUIContent(string.Empty, "Open at line...");
	private static int buttonHash = "Button".GetHashCode();
	private static Texture2D wrenchIcon;

	[NonSerialized]
	private bool hasSearchBoxFocus;
	private bool focusSearchBox = false;
	private static string defaultSearchString = string.Empty;
	private string searchString = defaultSearchString;
	[NonSerialized]
	private List<Rect> searchResults = new List<Rect>();
	[NonSerialized]
	private int searchResultsLength = 0;
	[NonSerialized]
	private int currentSearchResult = -1;
	private float pingTimer = 0f;
	private float pingStartTime = 0f;
	private GUIContent pingContent = new GUIContent();
	[NonSerialized]
	private Rect scrollToRect;


	public void OnEnable()
	{
		int themeIndex = -1;
		if (EditorPrefs.HasKey("ScriptInspectorTheme"))
		{
			string themeName = EditorPrefs.GetString("ScriptInspectorTheme");
			// He, he, a typo slipped in with the previous versions :P
			if (themeName == "Tango Ligth")
				themeName = "Tango Light";
			themeIndex = Array.IndexOf(availableThemes, themeName);
		}
		if (themeIndex == -1)
		{
			if (EditorGUIUtility.isProSkin)
				themeIndex = 2;
			else
				themeIndex = 1;
		}
		currentTheme = themes[themeIndex];

		showLineNumbers = EditorPrefs.GetBool("FlipbookGames.ScriptInspector.LineNumbers", true);

		Initialize();

		try
		{
			string assetPath = AssetDatabase.GetAssetOrScenePath(target);
			isJsFile = assetPath.EndsWith(".js", StringComparison.OrdinalIgnoreCase);
			isCsFile = assetPath.EndsWith(".cs", StringComparison.OrdinalIgnoreCase);
			isBooFile = assetPath.EndsWith(".boo", StringComparison.OrdinalIgnoreCase);
			streamReader = File.OpenText(assetPath);
		}
		catch
		{
		}

		lines = new List<string>();
		formatedLines = new FormatedLine[0];
		hyperlinks = new string[0];
		
		parsingBlockComment = false;
		parsingBlockString = false;
		numParsedLines = 0;

		contentWidth = 0;
	}

	public void Initialize()
	{
		if (!sorted)
		{
			Array.Sort(unityClasses);
			Array.Sort(jsKeywords);
			Array.Sort(booKeywords);
			sorted = true;
		}

		styles.scrollViewStyle = new GUIStyle(GUIStyle.none);
		//styles.scrollViewStyle.margin = new RectOffset(0, 0, 4, 0);
		//styles.scrollViewStyle.padding = new RectOffset(4, 4, 4, 4);
		//styles.scrollViewStyle.overflow = new RectOffset(0, 0, 4, 0);
		styles.searchResultStyle = new GUIStyle(GUIStyle.none);

		styles.normalStyle = new GUIStyle(GUIStyle.none);
		styles.normalStyle.font = (Font) Resources.Load("VeraMono", typeof(Font));
		charSize = styles.normalStyle.CalcSize(new GUIContent("W"));

		styles.hyperlinkStyle = new GUIStyle(styles.normalStyle);
		styles.mailtoStyle = new GUIStyle(styles.hyperlinkStyle);
		styles.keywordStyle = new GUIStyle(styles.normalStyle);
		styles.userTypeStyle = new GUIStyle(styles.normalStyle);
		styles.commentStyle = new GUIStyle(styles.normalStyle);
		styles.stringStyle = new GUIStyle(styles.normalStyle);
		styles.lineNumbersStyle = new GUIStyle(styles.normalStyle);
		styles.lineNumbersBackground = new GUIStyle(styles.normalStyle);
		styles.lineNumbersSeparator = new GUIStyle(styles.normalStyle);

		ApplyTheme();

		styles.upArrowStyle = new GUIStyle();
		styles.downArrowStyle = new GUIStyle();
		bool isProSkin = EditorGUIUtility.isProSkin;
		styles.upArrowStyle.normal.background = Resources.Load(isProSkin ? "d_upArrowOff" : "upArrowOff", typeof(Texture2D)) as Texture2D;
		styles.upArrowStyle.hover.background = styles.upArrowStyle.active.background =
			Resources.Load(isProSkin ? "d_upArrow" : "upArrow", typeof(Texture2D)) as Texture2D;
		styles.downArrowStyle.normal.background = Resources.Load(isProSkin ? "d_downArrowOff" : "downArrowOff", typeof(Texture2D)) as Texture2D;
		styles.downArrowStyle.hover.background = styles.downArrowStyle.active.background =
			Resources.Load(isProSkin ? "d_downArrow" : "downArrow", typeof(Texture2D)) as Texture2D;

		if (EditorGUIUtility.isProSkin)
			wrenchIcon = (Texture2D)Resources.Load("d_wrench", typeof(Texture2D));
		else
			wrenchIcon = (Texture2D)Resources.Load("l_wrench", typeof(Texture2D));

		if (styles.ping == null)
		{
			styles.ping = new GUIStyle();
			styles.ping.normal.background = (Texture2D)Resources.Load("yellowPing", typeof(Texture2D));
			styles.ping.normal.textColor = Color.black;
			styles.ping.font = styles.normalStyle.font;
			styles.ping.border = new RectOffset(10, 10, 10, 10);
			styles.ping.overflow = new RectOffset(7, 7, 6, 6);
			styles.ping.stretchWidth = false;
			styles.ping.stretchHeight = false;
		}
	}

	private static void ApplyTheme()
	{
		styles.scrollViewStyle.normal.background = FlatColorTexture(currentTheme.background);
		styles.searchResultStyle.normal.background = FlatColorTexture(currentTheme.searchResults);
		
		styles.normalStyle.normal.textColor = currentTheme.text;
		styles.keywordStyle.normal.textColor = currentTheme.keywords;
		styles.userTypeStyle.normal.textColor = currentTheme.knownTypes;
		styles.commentStyle.normal.textColor = currentTheme.comments;
		styles.stringStyle.normal.textColor = currentTheme.strings;

		styles.hyperlinkStyle.normal.textColor = currentTheme.hyperlinks;
		styles.mailtoStyle.normal.textColor = currentTheme.hyperlinks;
		styles.hyperlinkStyle.normal.background = styles.mailtoStyle.normal.background =
			UnderlineTexture(currentTheme.hyperlinks, (int)styles.mailtoStyle.lineHeight);

		styles.lineNumbersStyle.normal.textColor = currentTheme.lineNumbers;
		styles.lineNumbersStyle.hover.textColor = currentTheme.lineNumbersHighlight;
		styles.lineNumbersStyle.hover.background = UnderlineTexture(currentTheme.lineNumbersHighlight, (int)styles.lineNumbersStyle.lineHeight);

		styles.lineNumbersBackground.normal.background = FlatColorTexture(currentTheme.lineNumbersBackground);
		styles.lineNumbersSeparator.normal.background = FlatColorTexture(currentTheme.fold);
	}

	private static Texture2D FlatColorTexture(Color color)
	{
		Texture2D flat = new Texture2D(1, 1, TextureFormat.RGBA32, false);
		flat.SetPixels(new Color[] { color });
		flat.Apply();
		return flat;
	}

	private static Texture2D UnderlineTexture(Color color, int lineHeight)
	{
		return CreateUnderlineTexture(color, lineHeight, Color.clear);
	}

	private static Texture2D CreateUnderlineTexture(Color color, int lineHeight, Color bgColor)
	{
		Texture2D underlined = new Texture2D(1, lineHeight, TextureFormat.RGBA32, false);
		underlined.SetPixel(0, 0, color);
		for (int i = 1; i < lineHeight; ++i)
			underlined.SetPixel(0, i, new Color32(0, 0, 0, 0));
		underlined.Apply();
		return underlined;
	}

	private bool helpButtonClicked = false;

	public override void OnInspectorGUI()
	{
		// Disabling the functionality of the default inspector's header help button
		// (located just below the cancel search button) by zeroing hotControl on
		// mouse down, which effectivly deactivates the button so it doesn't fire up
		// on mouse up. Detection is done by comparing hotControl with the next available
		// controlID - 2, which is super-hacky, but so far I haven't found any nicer way
		// of doing this.
		int nextControlID = GUIUtility.GetControlID(buttonHash, FocusType.Native, new Rect());
		if (GUIUtility.hotControl != 0)
		{
			//Debug.Log("hotControl: " + GUIUtility.hotControl + "  nextControlID: " + nextControlID + "  Event: " + Event.current);
			if (GUIUtility.hotControl != 0 && GUIUtility.hotControl == nextControlID - 2)
			{
				GUIUtility.hotControl = 0;
				helpButtonClicked = true;
				Repaint();
			}
		}


		bool enabled = UnityEngine.GUI.enabled;
		UnityEngine.GUI.enabled = true;

		DoGUI(enabled);

		UnityEngine.GUI.enabled = enabled;
	}

	private void DoGUI(bool enableGUI)
	{
		if (!(isCsFile || isJsFile || isBooFile))
			return;

		if (Event.current.type == EventType.scrollWheel)
			needsRepaint = true;

		if (Event.current.type != EventType.layout)
			scrollViewRect = GUILayoutUtility.GetRect(1f, Screen.width, 1f, Screen.height);
		else
			GUILayoutUtility.GetRect(1f, Screen.width, 1f, Screen.height);

		scrollViewRect.yMin -= 33f;
		scrollViewRect.yMax += 13f;
		contentRect.Set(-4, -4, contentWidth + 8f, 8f + charSize.y * formatedLines.Length);

		DoToolbar();

		float margin = 0f;
		float lineNumbersWidth = 0f;
		int lineNumbersMaxLength = 0;

		if (pingTimer == 1f && Event.current.type != EventType.repaint)
		{
			//Debug.Log("Scrolling from " + scrollPosition.ToString());

			if (scrollToRect.yMin < scrollPosition.y + 30f ||
				scrollToRect.yMax > scrollPosition.y + scrollViewRect.height - 50f)
			{
				scrollPosition.y = Mathf.Max(0f, scrollToRect.center.y - scrollViewRect.height * 0.5f);
				needsRepaint = true;
			}

			if (showLineNumbers)
			{
				lineNumbersMaxLength = formatedLines.Length.ToString().Length;
				lineNumbersWidth = charSize.x * lineNumbersMaxLength;
				margin = lineNumbersWidth + 9f;
			}
			if (scrollToRect.xMin < scrollPosition.x + 30f ||
				scrollToRect.xMax > scrollPosition.x + scrollViewRect.width - 30f - margin)
			{
				scrollPosition.x = Mathf.Max(0f, scrollToRect.center.x - scrollViewRect.width * 0.5f);
				needsRepaint = true;
			}

			pingStartTime = Time.realtimeSinceStartup;
			//Debug.Log("  ...to " + scrollPosition.ToString());
		}

		int fromLine = (int)(scrollPosition.y / styles.normalStyle.lineHeight);
		int toLine = scrollViewRect.height > 0 ? fromLine + 2 + (int)(scrollViewRect.height / charSize.y)
			: (int)(Screen.height / styles.normalStyle.lineHeight);

		if (Event.current.type == EventType.repaint)
		{
			if (streamReader != null)
			{
				int i = numParsedLines;

				// We'll parse at least the next 32 lines, except on the first call
				Parse(numParsedLines > 0 ? Math.Max(toLine, numParsedLines + 32) : toLine);

				int maxLength = 0;
				while (i < numParsedLines)
					maxLength = Math.Max(maxLength, lines[i++].Length);
				contentWidth = Mathf.Max(contentWidth, charSize.x * maxLength);

				Repaint();

				if (streamReader == null && searchString != string.Empty)
				{
					SetSearchText(searchString);
					focusSearchBox = true;
				}
			}

			if (needsRepaint)
			{
				needsRepaint = false;
				Repaint();
			}
		}

		if (Event.current.type == EventType.layout)
			return;

		if (showLineNumbers)
		{
			lineNumbersMaxLength = formatedLines.Length.ToString().Length;
			lineNumbersWidth = charSize.x * lineNumbersMaxLength;
			margin = lineNumbersWidth + 9f;
			contentRect.xMax += margin;
		}

		// Filling the background
		UnityEngine.GUI.Label(scrollViewRect, GUIContent.none, styles.scrollViewStyle);

		scrollPosition = UnityEngine.GUI.BeginScrollView(scrollViewRect, scrollPosition, contentRect);

		if (needsRepaint)
		{
			UnityEngine.GUI.EndScrollView();
			return;
		}

		if (formatedLines.Length < toLine)
			toLine = formatedLines.Length;

		//contentRect.x += 4f + margin;
		//contentRect.y += 4f;
		//EditorGUI.TextArea(contentRect, target.ToString(), styles.normalStyle);

		if (Event.current.type == EventType.repaint)
		{
			Rect rc;
			foreach (Rect highlightRect in searchResults)
			{
				if (highlightRect.yMax > scrollPosition.y)
				{
					rc = highlightRect;
					rc.x += margin;
					UnityEngine.GUI.Label(rc, GUIContent.none, styles.searchResultStyle);

					if (highlightRect.yMin >= scrollPosition.y + scrollViewRect.height)
						break;
				}
			}
		}

		Rect tempRC = new Rect();
		for (int i = fromLine; i < toLine; ++i)
		{
			tempRC.x = margin;
			tempRC.y = charSize.y * i;
			tempRC.height = charSize.y;

			FormatedLine line = formatedLines[i];
			
			foreach (TextBlock block in line.textBlocks)
			{
				tempRC.width = charSize.x * block.text.Length;

				if (block.style == styles.hyperlinkStyle || block.style == styles.mailtoStyle)
				{
					if (UnityEngine.GUI.Button(tempRC, block.text, block.style))
					{
						if (block.style == styles.hyperlinkStyle)
							Application.OpenURL(block.text);
						else
							Application.OpenURL("mailto:" + block.text);
					}

					if (Event.current.type == EventType.repaint)
					{
						// show the "Link" cursor when the mouse is howering over this rectangle.
						EditorGUIUtility.AddCursorRect(tempRC, MouseCursor.Link);
					}
				}
				else
				{
					UnityEngine.GUI.Label(tempRC, block.text, block.style);
				}

				tempRC.x += tempRC.width;
			}
		}

		if (showLineNumbers)
		{
			if (Event.current.type == EventType.repaint)
			{
				tempRC.Set(0f, 0f, lineNumbersWidth + scrollPosition.x, charSize.y * formatedLines.Length);
				EditorGUIUtility.AddCursorRect(tempRC, MouseCursor.Link);

				tempRC.Set(-4f, -4f, 8f + lineNumbersWidth + scrollPosition.x, contentRect.height);

				// if the source code is shorter than the view...
				if (tempRC.height < scrollViewRect.height)
					tempRC.height = scrollViewRect.height;
				UnityEngine.GUI.Label(tempRC, GUIContent.none, styles.lineNumbersBackground);

				tempRC.xMin = 4f + lineNumbersWidth + scrollPosition.x;
				tempRC.width = 1f;
				UnityEngine.GUI.Label(tempRC, GUIContent.none, styles.lineNumbersSeparator);
			}

			for (int i = fromLine; i < toLine; ++i)
			{
				if (showLineNumbers)
				{
					lineNumberTooltip.text = (i + 1).ToString().PadLeft(lineNumbersMaxLength);
					tempRC.Set(scrollPosition.x, charSize.y * i, lineNumbersWidth, charSize.y);
					if (UnityEngine.GUI.Button(tempRC, lineNumberTooltip, styles.lineNumbersStyle))
					{
						AssetDatabase.OpenAsset(target, i + 1);
					}
				}
			}
		}

		if (Event.current.type == EventType.repaint && pingTimer > 0f)
			DrawPing(margin);

		UnityEngine.GUI.EndScrollView();
	}

	private void DrawPing(float indent)
	{
		if (styles.ping == null)
			return;

		pingTimer = 1f - (Time.realtimeSinceStartup - pingStartTime) * 0.25f;
		if (pingTimer < 0f)
			pingTimer = 0f;

		float t = (1f - pingTimer) * 64f;
		if (t > 0f && t < 64f)
		{
			scrollToRect.x += indent;

			GUIStyle ping = styles.ping;
			int left = ping.padding.left;
			ping.padding.left = 0;

			Color oldColor = UnityEngine.GUI.color;
			if (t > 56f)
			{
				UnityEngine.GUI.color = new Color(oldColor.r, oldColor.g, oldColor.b, oldColor.a * (64f - t) * 0.125f);
			}

			Matrix4x4 matrix = UnityEngine.GUI.matrix;
			if (t < 2f)
			{
				float scale = 2f - Mathf.Abs((float)(1f - t));
				Vector2 pos = scrollToRect.center;
				GUIUtility.ScaleAroundPivot(new Vector2(scale, scale), pos);
			}
			ping.Draw(scrollToRect, pingContent, false, false, false, false);
			UnityEngine.GUI.matrix = matrix;

			ping.padding.left = left;
			UnityEngine.GUI.color = oldColor;
			scrollToRect.x -= indent;
		}

		if (pingTimer > 0f)
			Repaint();
	}

	// "Links" drop-down menu items handler
	private void FollowHyperlink(object hyperlink)
	{
		Application.OpenURL((string) hyperlink);
	}

	private void DoToolbar()
	{
		Rect toolbarRect = new Rect(scrollViewRect.xMin, scrollViewRect.yMin - 18f, scrollViewRect.width, 17f);
		UnityEngine.GUI.Box(toolbarRect, GUIContent.none, EditorStyles.toolbar);

		UnityEngine.GUI.enabled = hyperlinks.Length > 0;
		GUIContent links = new GUIContent(hyperlinks.Length + " Link");
		if (hyperlinks.Length != 1)
			links.text += 's';

		Vector2 contentSize = EditorStyles.toolbarDropDown.CalcSize(links);
		Rect rc = new Rect(toolbarRect.xMin + 6f, toolbarRect.yMin, contentSize.x, contentSize.y);
		if (UnityEngine.GUI.Button(rc, links, EditorStyles.toolbarDropDown))
		{
			GenericMenu menu = new GenericMenu();
			foreach (string hyperlink in hyperlinks)
			{
				if (hyperlink.StartsWith("mailto:"))
				{
					menu.AddItem(new GUIContent(hyperlink.Substring(7)), false, FollowHyperlink, hyperlink);
				}
				else
				{
					// Shortenning the URL since we cannot display slashes in the menu item,
					// so in most cases we'll end up with something like www.flipbookgames.com...
					// The first two or three slashes and the last one will be trimmed too.
					string escaped = hyperlink.Substring(hyperlink.IndexOf(':') + 1);

					// Unity cannot display a slash in menu items. Replacing any remaining slashes with
					// the best alternative - backslash
					escaped = escaped.Replace('/', '\\');

					// On Windows the '&' has special meaning, unless it's escaped with another '&'
					if (Application.platform == RuntimePlatform.WindowsEditor)
					{
						int index = 0;
						while (index < escaped.Length && (index = escaped.IndexOf('&', index + 1)) >= 0)
							escaped = escaped.Insert(index++, "&");
					}

					menu.AddItem(new GUIContent(escaped.Trim('\\')), false, FollowHyperlink, hyperlink);
				}
			}
			menu.DropDown(rc);
		}
		UnityEngine.GUI.enabled = true;

		rc.y += 2f;
		rc.height = 16f;
		rc.xMin = rc.xMax + 8f;
		rc.xMax = toolbarRect.xMax - 25f;
		if (rc.width > 181f)
			rc.xMin = rc.xMax - 181f;
		DoSearchBox(rc);
		
		// Only redrawing the default wrench icon after being covered with our toolbar.
		// The defult icon still handles the functionality.
		if (wrenchIcon != null)
			UnityEngine.GUI.Label(new Rect(toolbarRect.xMax - 20f, toolbarRect.yMin + 2f, 15f, 14f), wrenchIcon, GUIStyle.none);
	}

	private void DoSearchBox(Rect position)
	{
		if ((Event.current.type == EventType.MouseDown) && position.Contains(Event.current.mousePosition))
		{
			focusSearchBox = true;
		}

		UnityEngine.GUI.SetNextControlName("SearchFilter");
		if (focusSearchBox)
		{
			UnityEngine.GUI.FocusControl("SearchFilter");
			if (Event.current.type == EventType.Repaint)
			{
				focusSearchBox = false;
			}
		}
		hasSearchBoxFocus = UnityEngine.GUI.GetNameOfFocusedControl() == "SearchFilter";

		if (Event.current.type == EventType.KeyDown)
		{
			if ((Event.current.control || Event.current.command) && Event.current.keyCode == KeyCode.F)
				focusSearchBox = true;

			if (Event.current.keyCode == KeyCode.Escape)
				SetSearchText(string.Empty);
			if (Event.current.keyCode == KeyCode.UpArrow)
			{
				SearchPrevious();
				Event.current.Use();
			}
			if (Event.current.keyCode == KeyCode.DownArrow)
			{
				SearchNext();
				Event.current.Use();
			}
			if (Event.current.keyCode == KeyCode.Return)
			{
				currentSearchResult = currentSearchResult < 0 ? 0 :
					currentSearchResult < searchResultsLength ? currentSearchResult : searchResultsLength - 1;
				ShowSearchResult(currentSearchResult);
			}
		}

		string text = ToolbarSearchField(position, searchString);
		
		if (searchString != text)
		{
			searchString = text;
			SetSearchText(searchString);
			hasSearchBoxFocus = true;
		}
		if (Event.current.type == EventType.KeyDown && Event.current.keyCode == KeyCode.Escape && searchString != string.Empty)
		{
			searchString = string.Empty;
			SetSearchText(searchString);
			Event.current.Use();
		}
	}

	private void SetSearchText(string text)
	{
		defaultSearchString = text;

		searchResults.Clear();
		searchResultsLength = 0;
		currentSearchResult = -1;
		int textLength = text.Length;

		if (textLength == 0)
		{
			Repaint();
			return;
		}

		int i = 0; 
		foreach (string line in lines)
		{
			for (int pos = 0; (pos = line.IndexOf(text, pos, StringComparison.InvariantCultureIgnoreCase)) != -1; pos += textLength )
			{
				Rect rc = new Rect(charSize.x * pos, charSize.y * i, textLength * charSize.x, charSize.y);
				searchResults.Add(rc);
				++searchResultsLength;
			}
			++i;
		}

		Repaint();
	}

	public static bool OverrideButton(Rect position, GUIContent content, GUIStyle style, bool forceHot)
	{
		int controlID = GUIUtility.GetControlID(buttonHash, FocusType.Passive, position);
		if (forceHot)
			GUIUtility.hotControl = controlID;

		switch (Event.current.GetTypeForControl(controlID))
		{
			case EventType.MouseDown:
				if (position.Contains(Event.current.mousePosition))
				{
					GUIUtility.hotControl = controlID;
					Event.current.Use();
				}
				return false;

			case EventType.MouseUp:
				if (GUIUtility.hotControl != controlID)
					return false;

				GUIUtility.hotControl = 0;
				Event.current.Use();
				return position.Contains(Event.current.mousePosition);

			case EventType.MouseDrag:
				if (GUIUtility.hotControl == controlID)
					Event.current.Use();
				break;

			case EventType.Repaint:
				style.Draw(position, content, controlID);
				break;
		}

		return false;
	}

	private string ToolbarSearchField(Rect position, string text)
    {
		if (styles.toolbarSearchField == null)
		{
			styles.toolbarSearchField = "ToolbarSeachTextField";
			styles.toolbarSearchFieldCancelButton = "ToolbarSeachCancelButton";
			styles.toolbarSearchFieldCancelButtonEmpty = "ToolbarSeachCancelButtonEmpty";
		}

        Rect rc = position;
        rc.width -= 14f;
		if (Event.current.type == EventType.repaint)
			styles.toolbarSearchField.Draw(rc, GUIContent.none, false, false, false, hasSearchBoxFocus);
        rc.width -= 20f;

		Color bgColor = UnityEngine.GUI.backgroundColor;
		UnityEngine.GUI.backgroundColor = Color.clear;
		text = EditorGUI.TextField(rc, text, styles.toolbarSearchField);
		UnityEngine.GUI.backgroundColor = bgColor;

		bool isEmpty = text == string.Empty;

		rc = position;
		rc.x += position.width - 14f;
		rc.width = 14f;
		if (!isEmpty)
		{
			if (OverrideButton(rc, GUIContent.none, styles.toolbarSearchFieldCancelButton, helpButtonClicked))
			{
				text = string.Empty;
				GUIUtility.keyboardControl = 0;
			}
		}
		else
		{
			UnityEngine.GUI.Label(rc, GUIContent.none, styles.toolbarSearchFieldCancelButtonEmpty);
			if (helpButtonClicked)
				focusSearchBox = true;
		}
		helpButtonClicked = false;

		rc.x -= 10f;
		rc.y += 1f;
        rc.width = 10f;
		rc.height = 13f;
		if (!isEmpty && searchResultsLength != 0 && UnityEngine.GUI.Button(rc, GUIContent.none, styles.upArrowStyle))
			SearchPrevious();

		rc.x -= 10f;
		if (!isEmpty && searchResultsLength != 0 && UnityEngine.GUI.Button(rc, GUIContent.none, styles.downArrowStyle))
			SearchNext();

        return text;
    }

	private void SearchPrevious()
	{
		currentSearchResult = currentSearchResult > 0 ? currentSearchResult - 1 : 0;
		ShowSearchResult(currentSearchResult);
	}

	private void SearchNext()
	{
		currentSearchResult = currentSearchResult < searchResultsLength - 1 ? currentSearchResult + 1 : searchResultsLength - 1;
		ShowSearchResult(currentSearchResult);
	}

	private void ShowSearchResult(int index)
	{
		if (index >= 0 && index < searchResultsLength)
		{
			scrollToRect = searchResults[index];
			pingTimer = 1f;
			pingStartTime = Time.realtimeSinceStartup;

			pingContent.text = lines[Mathf.RoundToInt(scrollToRect.y / charSize.y)].Substring(Mathf.RoundToInt(scrollToRect.x / charSize.x), searchString.Length);
			Repaint();
		}
	}

	[MenuItem("CONTEXT/MonoScript/Line Numbers", false, 141)]
	private static void ToggleLineNumbers()
	{
		showLineNumbers = !showLineNumbers;
		EditorPrefs.SetBool("FlipbookGames.ScriptInspector.LineNumbers", showLineNumbers);
		foreach (Editor editor in ActiveEditorTracker.sharedTracker.activeEditors)
			editor.Repaint();
	}

	[MenuItem("CONTEXT/MonoScript/Visual Studio Style", false, 160)]
	private static void SetStyleVisualStudio()
	{
		SelectTheme(0);
	}

	[MenuItem("CONTEXT/MonoScript/Xcode Style", false, 161)]
	private static void SetStyleXcode()
	{
		SelectTheme(1);
	}

	[MenuItem("CONTEXT/MonoScript/Tango Dark (Oblivion) Style", false, 162)]
	private static void SetStyleTangoDark()
	{
		SelectTheme(2);
	}

	[MenuItem("CONTEXT/MonoScript/Tango Light Style", false, 163)]
	private static void SetStyleTangoLight()
	{
		SelectTheme(3);
	}

	private static void SelectTheme(int themeIndex)
	{
		EditorPrefs.SetString("ScriptInspectorTheme", availableThemes[themeIndex]);
		if (currentTheme != themes[themeIndex])
		{
			currentTheme = themes[themeIndex];
			ApplyTheme();
			foreach (Editor editor in ActiveEditorTracker.sharedTracker.activeEditors)
				editor.Repaint();
		}
	}

	[MenuItem("CONTEXT/MonoScript/About", false, 192)]
	private static void About()
	{
		EditorWindow.GetWindow<AboutScriptInspector>();
	}

	private static string[] spaces = { "    ", "   ", "  ", " "};
	private static string ExpandTabs(string s)
	{
		// Tabs must be replaced with spaces for proper alignment
		int tabPos;
		int startFrom = 0;
		StringBuilder sb = new StringBuilder();
		while ((tabPos = s.IndexOf('\t', startFrom)) != -1)
		{
			sb.Append(s, startFrom, tabPos - startFrom);
			sb.Append(spaces[sb.Length & 3]);
			startFrom = tabPos + 1;
		}
		sb.Append(s.Substring(startFrom));
		return sb.ToString();
	}

	private void Parse(int parseToLine)
	{
		// Is there still anything left for reading/parsing?
		if (streamReader == null)
			return;

		// Reading lines till parseToLine-th line
		string line;
		for (int i = lines.Count; i < parseToLine; ++i)
		{
			line = streamReader.ReadLine();
			if (line == null)
			{
				streamReader.Close();
				streamReader.Dispose();
				streamReader = null;
				break;
			}
			lines.Add(ExpandTabs(line));
		}
		if (formatedLines.Length == lines.Count)
			return;

		parseToLine = lines.Count;
		Array.Resize(ref formatedLines, parseToLine);

		for (int currentLine = numParsedLines; currentLine < parseToLine; ++currentLine)
		{
			FormatedLine formatedLine = formatedLines[currentLine] = new FormatedLine();
			line = lines[currentLine];
			if (line.Length == 0)
			{
				formatedLine.textBlocks = new TextBlock[] { new TextBlock(string.Empty, styles.normalStyle) };
				continue;
			}

			List<TextBlock> blocks = new List<TextBlock>();

			bool checkPreprocessor = true;
			int startIndex = 0;
			while (startIndex < line.Length)
			{
				int index;

				if (parsingBlockComment)
				{
					index = line.IndexOf("*/", startIndex);
					if (index == -1)
					{
						PushComment(ref blocks, line.Substring(startIndex));
						break;
					}
					else
					{
						PushComment(ref blocks, line.Substring(startIndex, index - startIndex + 2));
						startIndex = index + 2;
						parsingBlockComment = false;
						continue;
					}
				}
				else if (parsingBlockString)
				{
					//int firstIndex = IndexOf2(line, startIndex, '\\', '\"');
					index = line.IndexOf("\"\"\"", startIndex);
					if (index == -1)
					{
						blocks.Add(new TextBlock(line.Substring(startIndex), styles.stringStyle));
						break;
					}
					else
					{
						blocks.Add(new TextBlock(line.Substring(startIndex, index - startIndex + 3), styles.stringStyle));
						startIndex = index + 3;
						parsingBlockString = false;
						continue;
					}
				}

				if (isBooFile)
					index = IndexOf5(line, startIndex, "\"", "'", "#", "//", "/*");
				else if (checkPreprocessor)
					index = IndexOf6(line, startIndex, "\"", "'", "#", "@\"", "//", "/*");
				else
					index = IndexOf5(line, startIndex, "\"", "'", "@\"", "//", "/*");
				if (index == -1)
					index = line.Length;

				if (index > 0)
				{
					string directive = PushCode(ref blocks, line.Substring(startIndex, index - startIndex), startIndex == 0
						|| checkPreprocessor && line.Substring(0, startIndex).Trim() == string.Empty);
					if (directive != null)
					{
						index = line.IndexOf('#') + directive.Length;
						if (index == line.Length)
							break;

						int indexLineComment = directive.Trim() == "#region" ? -1 : line.IndexOf("//", index);
						if (indexLineComment != -1)
						{
							blocks.Add(new TextBlock(line.Substring(index, indexLineComment - index), styles.normalStyle));
							PushComment(ref blocks, line.Substring(indexLineComment));
						}
						else
						{
							blocks.Add(new TextBlock(line.Substring(index), styles.normalStyle));
						}
						break;
					}
					else
						checkPreprocessor = false;
				}

				startIndex = index;

				if (index < line.Length)
				{
					if (line[index] == '@')
						++index;
					else if (isBooFile && index < line.Length - 2 && line.Substring(index, 3) == "\"\"\"")
					{
						// String block starting with """
						blocks.Add(new TextBlock("\"\"\"", styles.stringStyle));
						startIndex += 3;
						parsingBlockString = true;
						continue;
					}

					char terminalChar = line[index];
					if (terminalChar == '\"' || terminalChar == '\'')
					{
						// String, Char, or RegExp literal
						for (++index; index < line.Length; )
						{
							index = IndexOf2(line, index, terminalChar, '\\');
							if (index == -1)
							{
								index = line.Length;
								break;
							}
							else if (line[index] == '\\')
							{
								++index;
								if (index == line.Length)
									break;
								++index;
							}
							else
							{
								++index;
								break;
							}
						};

						blocks.Add(new TextBlock(line.Substring(startIndex, index - startIndex), styles.stringStyle));
						startIndex = index;
					}
					else if (line[index] == '#' || line[index + 1] == '/')
					{
						// Comment till end of line
						PushComment(ref blocks, line.Substring(index));
						break;
					}
					else
					{
						// Comment block starting with /*
						PushComment(ref blocks, line.Substring(index, 2));
						startIndex += 2;
						parsingBlockComment = true;
					}
				}
			}

			formatedLine.textBlocks = blocks.ToArray();
		}

		numParsedLines = parseToLine;
	}

	static Regex emailRegex = new Regex(@"\b([A-Z0-9._%-]+)@([A-Z0-9.-]+\.[A-Z]{2,6})\b", RegexOptions.IgnoreCase);

	private void PushComment(ref List<TextBlock> blocks, string line)
	{
		string address;
		int index;

		for (int startAt = 0; startAt < line.Length; )
		{
			int hyperlink = IndexOf3(line, startAt, "http://", "https://", "ftp://");
			if (hyperlink == -1)
				hyperlink = line.Length;

			while (hyperlink != startAt)
			{
				Match emailMatch = emailRegex.Match(line, startAt, hyperlink - startAt);
				if (emailMatch.Success)
				{
					if (emailMatch.Index > startAt)
						blocks.Add(new TextBlock(line.Substring(startAt, emailMatch.Index - startAt), styles.commentStyle));

					address = line.Substring(emailMatch.Index, emailMatch.Length);
					blocks.Add(new TextBlock(address, styles.mailtoStyle));
					address = "mailto:" + address;
					index = Array.BinarySearch<string>(hyperlinks, address);
					if (index < 0)
						ArrayUtility.Insert(ref hyperlinks, -1 - index, address);

					startAt = emailMatch.Index + emailMatch.Length;
					continue;
				}

				blocks.Add(new TextBlock(line.Substring(startAt, hyperlink - startAt), styles.commentStyle));
				startAt = hyperlink;
			}

			if (startAt == line.Length)
				break;

			int i = line.IndexOf(':', startAt) + 3;
			while (i < line.Length)
			{
				char c = line[i];
				if (c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c >= '0' && c <= '9' || c == '_' || c == '.' ||
					c == '-' || c == '=' || c == '+' || c == '%' || c == '&' || c == '?' || c == '/' || c == '#')
					++i;
				else
					break;
			}

			address = line.Substring(startAt, i - startAt);
			blocks.Add(new TextBlock(address, styles.hyperlinkStyle));
			index = Array.BinarySearch<string>(hyperlinks, address);
			if (index < 0)
				ArrayUtility.Insert(ref hyperlinks, -1 - index, address);

			startAt = i;
		}
	}

	private string PushCode(ref List<TextBlock> blocks, string line, bool checkPreprocessor)
	{
		int startAt = 0;
		while (startAt < line.Length)
		{
			char c = line[startAt];
			if (c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c == '_' || checkPreprocessor && c == '#')
			{
				int i = startAt + 1;
				for (; i < line.Length; ++i)
				{
					c = line[i];
					if (!(c >= '0' && c <= '9' || c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c == '_'))
						break;
				}
				string word = line.Substring(startAt, i - startAt);

				if (checkPreprocessor && IsPreprocessorDirective(word))
				{
					blocks.Add(new TextBlock(word, styles.keywordStyle));
					return word;
				}
				checkPreprocessor = false;

				if (IsKeyword(word))
					blocks.Add(new TextBlock(word, styles.keywordStyle));
				else if (IsUnityType(word))
					blocks.Add(new TextBlock(word, styles.userTypeStyle));
				else
					blocks.Add(new TextBlock(word, styles.normalStyle));
				startAt = i;
			}
			else
			{
				int i = startAt + 1;
				for (; i < line.Length; ++i)
				{
					c = line[i];
					if (c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' || c == '_')
						break;
				}
				blocks.Add(new TextBlock(line.Substring(startAt, i - startAt), styles.normalStyle));
				startAt = i;

				checkPreprocessor = checkPreprocessor &&
					line.Substring(startAt, i - startAt).TrimEnd(new char[] {' '}).Length != 0;
			}
		}

		return null;
	}

#region private static definitions
	private static bool sorted = false;

	private static string[] preprocessor = new string[] {
		"#define", "#elif", "#else", "#endif", "#endregion", "#error", "#if", "#line", "#pragma", "#region", "#undef", "#warning"
	};

	private static string[] csKeywords = new string[] {
		"abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked",
		"class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else",
		"enum", "event", "explicit", "extern", "false", "finally", "fixed", "float", "for",
		"foreach", "goto", "if", "implicit", "in", "int", "interface", "internal", "is", "lock",
		"long", "namespace", "new", "null", "object", "operator", "out", "override", "params",
		"private", "protected", "public", "readonly", "ref", "return", "sbyte", "sealed", "short",
		"sizeof", "stackalloc", "static", "string", "struct", "switch", "this", "throw", "true",
		"try", "typeof", "uint", "ulong", "unchecked", "unsafe", "ushort", "using", "virtual",
		"void", "volatile", "while"
	};

	private static string[] jsKeywords = new string[] {
		"abstract", "else", "instanceof", "super", "boolean", "enum", "int", "switch", "break", "static",
		"export", "interface", "synchronized", "byte", "extends", "let", "this", "case", "false", "with",
		"long", "throw", "catch", "final", "native", "throws", "char", "finally", "new", "transient",
		"class", "float", "null", "true", "const", "for", "package", "try", "continue", "function",
		"private", "typeof", "debugger", "goto", "protected", "var", "default", "if", "public", "void",
		"delete", "implements", "return", "volatile", "do", "import", "short", "while", "double", "in",
	};

	private static string[] booKeywords = new string[] {
		"abstract", "and", "as", "break", "callable", "cast", "class", "const", "constructor", "destructor", "continue",
		"def", "do", "elif", "else", "enum", "ensure", "event", "except", "final", "for", "from", "given", "get", "goto",
		"if", "interface", "in", "include", "import", "is", "isa", "mixin", "namespace", "not", "or", "otherwise",
		"override", "pass", "raise", "retry", "self", "struct", "return", "set", "success", "try", "transient", "virtual",
		"while", "when", "unless", "yield", 

		"public", "protected", "private", "internal", "static", 

		"bool", "string", "object", "byte", "sbyte", "short", "ushort", "char", "int", "uint", "long", "ulong", "single",
 		"double", "decimal", "date", "timespan", "void", 

		// builtin
		"len", "__addressof__", "__eval__", "__switch__", "array", "matrix", "typeof", "assert", "print", "gets", "prompt", 
		"enumerate", "zip", "filter", "map",
	};

	private static string[] unityClasses = new string[] {
		// Runtime classes
		"ADBannerView", "ADError", "ADInterstitialAd", "AccelerationEvent", "ActionScript", "AndroidInput",
		"AndroidJNIHelper", "AndroidJNI", "AndroidJavaObject", "AndroidJavaClass", "AnimationCurve", "AnimationEvent",
		"AnimationState", "Application", "Array", "AudioSettings", "BitStream", "BoneWeight", "Bounds", "Caching",
		"ClothSkinningCoefficient", "Collision", "Color32", "Color", "CombineInstance", "Compass", "ContactPoint",
		"ControllerColliderHit", "Debug", "DetailPrototype", "Event", "GL", "GUIContent", "GUILayoutOption",
		"GUILayoutUtility", "GUILayout", "GUISettings", "GUIStyleState", "GUIStyle", "GUIUtility", "GUI", "GeometryUtility",
		"Gizmos", "Graphics", "Gyroscope", "Handheld", "Hashtable", "HostData", "IAchievementDescription", "IAchievement",
		"ILeaderboard", "IScore", "ISocialPlatform", "GameCenterPlatform", "IUserProfile", "ILocalUser", "Input",
		"JointDrive", "JointLimits", "JointMotor", "JointSpring", "Keyframe", "LayerMask", "LightmapData", "LightmapSettings",
		"LocalNotification", "LocationInfo", "LocationService", "MasterServer", "MaterialPropertyBlock", "Mathf", "Matrix4x4",
		"Microphone", "NavMeshHit", "NavMeshPath", "NetworkMessageInfo", "NetworkPlayer", "NetworkViewID", "Network",
		"NotificationServices", "Object", "AnimationClip", "AssetBundle", "AudioClip", "Component", "Behaviour", "Animation",
		"AudioChorusFilter", "AudioDistortionFilter", "AudioEchoFilter", "AudioHighPassFilter", "AudioListener",
		"AudioLowPassFilter", "AudioReverbFilter", "AudioReverbZone", "AudioSource", "Camera", "ConstantForce", "GUIElement",
		"GUIText", "GUITexture", "GUILayer", "LensFlare", "Light", "MonoBehaviour", "Terrain", "NavMeshAgent", "NetworkView",
		"Projector", "Skybox", "Cloth", "InteractiveCloth", "SkinnedCloth", "Collider", "BoxCollider", "CapsuleCollider",
		"CharacterController", "MeshCollider", "SphereCollider", "TerrainCollider", "WheelCollider", "Joint", "CharacterJoint",
		"ConfigurableJoint", "FixedJoint", "HingeJoint", "SpringJoint", "LODGroup", "LightProbeGroup", "MeshFilter",
		"OcclusionArea", "OcclusionPortal", "OffMeshLink", "ParticleAnimator", "ParticleEmitter", "ParticleSystem", "Renderer",
		"ClothRenderer", "LineRenderer", "MeshRenderer", "ParticleRenderer", "ParticleSystemRenderer", "SkinnedMeshRenderer",
		"TrailRenderer", "Rigidbody", "TextMesh", "Transform", "Tree", "Flare", "Font", "GameObject", "LightProbes",
		"Material", "ProceduralMaterial", "Mesh", "NavMesh", "PhysicMaterial", "QualitySettings", "ScriptableObject",
		"GUISkin", "Shader", "TerrainData", "TextAsset", "Texture", "Cubemap", "MovieTexture", "RenderTexture", "Texture2D",
		"WebCamTexture", "OffMeshLinkData", "ParticleSystem", "Particle", "Path", "Physics", "Ping", "Plane",
		"PlayerPrefsException", "PlayerPrefs", "ProceduralPropertyDescription", "Profiler", "Quaternion", "Random", "Range",
		"Ray", "RaycastHit", "RectOffset", "Rect", "RemoteNotification", "RenderBuffer", "RenderSettings", "Resolution",
		"Resources", "Screen", "Security", "SleepTimeout", "Social", "SoftJointLimit", "SplatPrototype",
		"StaticBatchingUtility", "String", "SystemInfo", "Time", "TouchScreenKeyboard", "Touch", "TreeInstance",
		"TreePrototype", "Vector2", "Vector3", "Vector4", "WWWForm", "WWW", "WebCamDevice", "WheelFrictionCurve", "WheelHit",
		"YieldInstruction", "AsyncOperation", "AssetBundleCreateRequest", "AssetBundleRequest", "Coroutine",
		"WaitForEndOfFrame", "WaitForFixedUpdate", "WaitForSeconds", "iPhoneInput", "iPhoneSettings", "iPhoneUtils", "iPhone",

		// Runtime attributes
		"AddComponentMenu", "ContextMenu", "ExecuteInEditMode", "HideInInspector", "ImageEffectOpaque",
		"ImageEffectTransformsToLDR", "NonSerialized", "NotConvertedAttribute", "NotRenamedAttribute", "RPC",
		"RequireComponent", "Serializable", "SerializeField",

		// Runtime enumerations
		"ADErrorCode", "ADPosition", "ADSizeIdentifier", "AnimationBlendMode", "AnimationCullingType", "AnisotropicFiltering",
		"AudioReverbPreset", "AudioRolloffMode", "AudioSpeakerMode", "AudioType", "AudioVelocityUpdateMode", "BlendWeights",
		"CalendarIdentifier", "CalendarUnit", "CameraClearFlags", "CollisionDetectionMode", "CollisionFlags", "ColorSpace",
		"ConfigurableJointMotion", "ConnectionTesterStatus", "CubemapFace", "DepthTextureMode", "DetailRenderMode",
		"DeviceOrientation", "DeviceType", "EventType", "FFTWindow", "FilterMode", "FocusType", "FogMode", "FontStyle",
		"ForceMode", "FullScreenMovieControlMode", "FullScreenMovieScalingMode", "HideFlags", "IMECompositionMode",
		"ImagePosition", "JointDriveMode", "JointProjectionMode", "KeyCode", "LightRenderMode", "LightShadows", "LightType",
		"LightmapsMode", "LocationServiceStatus", "LogType", "MasterServerEvent", "NavMeshPathStatus", "NetworkConnectionError",
		"NetworkDisconnection", "NetworkLogLevel", "NetworkPeerType", "NetworkReachability", "NetworkStateSynchronization",
		"ObstacleAvoidanceType", "OffMeshLinkType", "ParticleRenderMode", "ParticleSystemRenderMode", "PhysicMaterialCombine",
		"PlayMode", "PrimitiveType", "ProceduralCacheSize", "ProceduralProcessorUsage", "ProceduralPropertyType", "QueueMode",
		"RPCMode", "RemoteNotificationType", "RenderTextureFormat", "RenderTextureReadWrite", "RenderingPath",
		"RigidbodyConstraints", "RigidbodyInterpolation", "RotationDriveMode", "RuntimePlatform", "ScaleMode",
		"ScreenOrientation", "SendMessageOptions", "ShadowProjection", "SkinQuality", "Space", "SystemLanguage", "TextAlignment",
		"TextAnchor", "TextClipping", "TextureCompressionQuality", "TextureFormat", "TextureWrapMode", "ThreadPriority",
		"TimeScope", "TouchPhase", "TouchScreenKeyboardType", "UserAuthorization", "UserScope", "UserState", "WrapMode",
		"iPhoneGeneration",

		// Editor classes
		"AnimationClipCurveData", "AnimationUtility", "ArrayUtility", "AssetDatabase", "AssetImporter", "AudioImporter",
		"ModelImporter", "MovieImporter", "SubstanceImporter", "TextureImporter", "TrueTypeFontImporter",
		"AssetModificationProcessor", "AssetPostprocessor", "AssetStore", "BuildPipeline", "DragAndDrop", "EditorApplication",
		"EditorBuildSettings", "EditorGUILayout", "EditorGUIUtility", "EditorGUI", "EditorPrefs", "EditorStyles",
		"EditorUserBuildSettings", "EditorUtility", "EditorWindow", "ScriptableWizard", "Editor", "FileUtil",
		"GameObjectUtility", "GenericMenu", "HandleUtility", "Handles", "Help", "LODUtility", "LightmapEditorSettings",
		"Lightmapping", "MenuCommand", "MeshUtility", "ModelImporterClipAnimation", "MonoScript", "NavMeshBuilder",
		"ObjectNames", "Android", "Wii", "iOS", "PlayerSettings", "PrefabUtility", "ProceduralTexture", "PropertyModification",
		"Selection", "SerializedObject", "SerializedProperty", "StaticOcclusionCullingVisualization", "StaticOcclusionCulling",
		"SubstanceArchive", "TextureImporterSettings", "Tools", "Undo", "UnwrapParam", "Unwrapping",

		// Editor attributes
		"CanEditMultipleObjects", "CustomEditor", "DrawGizmo", "MenuItem", "PreferenceItem",

		// Editor enumerations
		"AndroidBuildSubtarget", "AndroidPreferredInstallLocation", "AndroidSdkVersions",
		"AndroidShowActivityIndicatorOnLoading", "AndroidSplashScreenScale", "AndroidTargetDevice", "AndroidTargetGraphics",
		"ApiCompatibilityLevel", "AspectRatio", "AssetDeleteResult", "AssetMoveResult", "AudioImporterFormat",
		"AudioImporterLoadType", "BuildAssetBundleOptions", "BuildOptions", "BuildTargetGroup", "BuildTarget",
		"DragAndDropVisualMode", "DrawCameraMode", "EditorSkin", "ExportPackageOptions", "FontRenderMode", "FontTextureCase",
		"GizmoType", "ImportAssetOptions", "InspectorMode", "LightmapBakeQuality", "MessageType",
		"ModelImporterAnimationCompression", "ModelImporterGenerateAnimations", "ModelImporterMaterialName",
		"ModelImporterMaterialSearch", "ModelImporterMeshCompression", "ModelImporterTangentSpaceMode", "MouseCursor",
		"PS3BuildSubtarget", "PivotMode", "PivotRotation", "PrefabType", "ProceduralOutputType", "RemoveAssetOptions",
		"ReplacePrefabOptions", "ResolutionDialogSetting", "ScriptCallOptimizationLevel", "SelectionMode",
		"SerializedPropertyType", "StaticEditorFlags", "StaticOcclusionCullingMode", "StrippingLevel", "TextureImporterFormat",
		"TextureImporterGenerateCubemap", "TextureImporterMipFilter", "TextureImporterNPOTScale", "TextureImporterNormalFilter",
		"TextureImporterType", "Tool", "UIOrientation", "ViewTool", "WiiBuildDebugLevel", "WiiBuildSubtarget", "WiiHio2Usage",
		"WiiMemoryArea", "WiiMemoryLabel", "WiiRegion", "XboxBuildSubtarget", "XboxRunMethod", "iOSSdkVersion",
		"iOSShowActivityIndicatorOnLoading", "iOSStatusBarStyle", "iOSTargetDevice", "iOSTargetOSVersion", "iOSTargetPlatform",
		"iOSTargetResolution", 
	};
#endregion

	private static bool IsPreprocessorDirective(string word)
	{
		return Array.BinarySearch(preprocessor, word) >= 0;
	}

	private bool IsKeyword(string word)
	{
		if (isCsFile)
			return Array.BinarySearch(csKeywords, word) >= 0;
		else if (isJsFile)
			return Array.BinarySearch(jsKeywords, word) >= 0;
		else if (isBooFile)
			return Array.BinarySearch(booKeywords, word) >= 0;
		else
			return false;
	}

	private static bool IsUnityType(string word)
	{
		return Array.BinarySearch(unityClasses, word) >= 0;
	}

	private static int IndexOf2(string line, int startIndex, char s1, char s2)
	{
		uint i1 = (uint)line.IndexOf(s1, startIndex);
		uint i2 = (uint)line.IndexOf(s2, startIndex);
		return (int)System.Math.Min(i1, i2);
	}

	private static int IndexOf3(string line, int startIndex, string s1, string s2, string s3)
	{
		uint i1 = (uint)line.IndexOf(s1, startIndex, StringComparison.OrdinalIgnoreCase);
		uint i2 = (uint)line.IndexOf(s2, startIndex, StringComparison.OrdinalIgnoreCase);
		uint i3 = (uint)line.IndexOf(s3, startIndex, StringComparison.OrdinalIgnoreCase);
		return (int)System.Math.Min(System.Math.Min(i1, i2), i3);
	}

	private static int IndexOf5(string line, int startIndex, string s1, string s2, string s3, string s4, string s5)
	{
		uint i1 = (uint)line.IndexOf(s1, startIndex);
		uint i2 = (uint)line.IndexOf(s2, startIndex);
		uint i3 = (uint)line.IndexOf(s3, startIndex);
		uint i4 = (uint)line.IndexOf(s4, startIndex);
		uint i5 = (uint)line.IndexOf(s5, startIndex);
		return (int)System.Math.Min(i5, System.Math.Min(System.Math.Min(i1, i2), System.Math.Min(i3, i4)));
	}

	private static int IndexOf6(string line, int startIndex, string s1, string s2, string s3, string s4, string s5, string s6)
	{
		uint i1 = (uint)line.IndexOf(s1, startIndex);
		uint i2 = (uint)line.IndexOf(s2, startIndex);
		uint i3 = (uint)line.IndexOf(s3, startIndex);
		uint i4 = (uint)line.IndexOf(s4, startIndex);
		uint i5 = (uint)line.IndexOf(s5, startIndex);
		uint i6 = (uint)line.IndexOf(s6, startIndex);
		return (int)System.Math.Min(i6, System.Math.Min(i5, System.Math.Min(System.Math.Min(i1, i2), System.Math.Min(i3, i4))));
	}
}
