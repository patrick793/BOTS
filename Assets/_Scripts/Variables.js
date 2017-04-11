#pragma strict

class Variables{

	private var varList : Dictionary.<String,Variable>;
	private var varNames : List.<String>;
	
	//Singleton instance
	public static var instance : Variables;
	
	//Singleton constructor
	public static function Get(){
		if( instance == null )
			instance = new Variables();
		return instance;
	}
	private function Variables(){
		varList = new Dictionary.<String,Variable>();
		varNames = new List.<String>();
	}
	
	//Function to register a new variable
	public function registerVariable( varName : String ){
		if( !varList.ContainsKey(varName) ){
			varList.Add( varName, new Variable() );
			varNames.Add(varName);
		}
		varList[varName].val = 0;
	}
	
	//Function to set the value of a variable
	public function setVal( varName : String, value : int ){
		if( varList.ContainsKey(varName) ){
			varList[varName].val = value;
		}
	}
	
	//Function to get the value of a variable
	public function getVal( varName : String ) : int{
		if( varList.ContainsKey(varName) ){
			return varList[varName].val;
		}
		return 0;
	}
	
	public function reset(){
		for( var s : String in varNames ){
			varList[s].val = 0;
		}
	}

	//Bean class for variables
	class Variable{
		public var val : int;
	}

}