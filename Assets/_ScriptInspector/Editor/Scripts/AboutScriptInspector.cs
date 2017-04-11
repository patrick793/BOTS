/* SCRIPT INSPECTOR for Unity3D
 * version 1.3.1, August 2012
 * Copyright © 2012, Flipbook Games
 * 
 * Custom Inspector for C#, JavaScript and Boo scripts
 * 
 * Visit http://flipbookgames.com/ for more info.
 * Contact info@flipbookgames.com for feedback, bug reports, or suggestions.
 */

using UnityEditor;
using UnityEngine;

public class AboutScriptInspector : EditorWindow
{
	private GUIStyle textStyle;
	private GUIStyle bigTextStyle;
	private GUIStyle miniTextStyle;
	private Texture2D flipbookLogo;

	private void OnEnable()
	{
		title = "About";
		minSize = new Vector2(265f, 155f);
		maxSize = new Vector2(265f, 155.1f);
	}

	void Initialize()
	{
		textStyle = new GUIStyle();
		textStyle.alignment = TextAnchor.UpperCenter;
		
		bigTextStyle = new GUIStyle(EditorStyles.boldLabel);
		bigTextStyle.fontSize = 24;
		bigTextStyle.alignment = TextAnchor.UpperCenter;
		
		miniTextStyle = new GUIStyle(EditorStyles.miniLabel);
		miniTextStyle.alignment = TextAnchor.UpperCenter;

		flipbookLogo = (Texture2D) Resources.Load("CreatedByFlipbookGames", typeof(Texture2D));
	}

	private void OnGUI()
	{
		if (textStyle == null)
			Initialize();

		EditorGUILayout.BeginVertical();

		GUILayout.Box("Script Inspector", bigTextStyle);
		GUILayout.Label("\xa9 Flipbook Games. All Rights Reserved.", miniTextStyle);
		GUILayout.Label("Version " + ScriptInspector.GetVersionString(), textStyle);

		GUILayout.FlexibleSpace();
		
		GUILayout.BeginHorizontal();
		GUILayout.Space(20f);
		if (GUILayout.Button(flipbookLogo, GUIStyle.none))
		{
			Application.OpenURL("http://www.flipbookgames.com/");
		}
		if (Event.current.type == EventType.repaint)
		{
			EditorGUIUtility.AddCursorRect(GUILayoutUtility.GetLastRect(), MouseCursor.Link);
		}
		GUILayout.FlexibleSpace();
		GUILayout.BeginVertical();
		GUILayout.FlexibleSpace();
		if (GUILayout.Button("Close"))
		{
			Close();
		}
		GUILayout.Space(2f);
		GUILayout.EndVertical();
		GUILayout.Space(10f);
		GUILayout.EndHorizontal();
		
		GUILayout.Space(10f);

		EditorGUILayout.EndVertical();
	}
}
