class TextSanitizer
{
	static function Alpha()
	{
		var c = Event.current.character;
	    if ( (c >= 'a'[0] && c <= 'z'[0]) || (c >= 'A'[0] && c <= 'Z'[0]) || c == ' '[0] || c == '-'[0])
	    	Debug.Log("Current Event Character: " + c);
    	else
    		Event.current.character = '\0'[0];
	}
	static function Numeric()
	{
		var c = Event.current.character;
	    if ( (c >= '0'[0] && c <= '9'[0]) || c == '-'[0])
	        Debug.Log("Current Event Character: " + c);
	    else
	    	Event.current.character = '\0'[0];
	}
	static function AlphaNumeric()
	{
		var c = Event.current.character;
	    if ( (c >= 'a'[0] && c <= 'z'[0]) || (c >= 'A'[0] && c <= 'Z'[0]) || c == ' '[0] || (c >= '0'[0] && c <= '9'[0]) || c == '-'[0] )
	    	Debug.Log("Current Event Character: " + c);
	    else
	    	Event.current.character = '\0'[0];
	}
}