#pragma strict
@script ExecuteInEditMode()

function Update () {
	transform.eulerAngles = Camera.main.transform.eulerAngles;
}