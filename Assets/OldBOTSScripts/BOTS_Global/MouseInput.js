class MouseInput
{
	static function GetPosition() : Point
	{
		return new Point(Input.mousePosition.x, Screen.height - Input.mousePosition.y);
	}
}