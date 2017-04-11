#pragma strict
public var mystuff : GameObject[];

function Start () {
	mystuff = GameObject.FindGameObjectsWithTag("Finish");
	
	for (item in mystuff)
	{
		GameObject.Destroy(item);
	}
}

function Update () {

}