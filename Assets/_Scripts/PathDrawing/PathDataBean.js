#pragma strict

public class PathDataBean{

	public enum Completion {COMPLETE,INCOMPLETE,ERROR};
	
	public var userID : String;
	public var levelID : int;
	public var botPaths : BotPath[];
	public var completion : Completion;

	
	function PathDataBean( userID : String, levelID : int, botPaths : BotPath[], completion : Completion ){
		this.userID = userID;
		this.levelID = levelID;
		this.botPaths = botPaths;
		this.completion = completion;
	}
	
	public class BotPath{
		public var commandList : String[];
		function BotPath( commands : String[] ){
			commandList = commands;
		}
	}
	

}