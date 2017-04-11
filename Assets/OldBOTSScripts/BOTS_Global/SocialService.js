class SocialService
{
	static function GetMessages()
	{
		Debug.Log("Getting Messages");
	}
	
	static function GetUsersFollowing()
	{
		Debug.Log("Getting Users that you are following");
	}
	
	static function SendMessage(user : String)
	{
		Debug.Log("Send Message to User: " + user);
	}
	
	static function FollowUser(user : String)
	{
		Debug.Log("Follow User: " + user);
	}
	
}