import System.Collections.Generic;

class PriorityQueue{
  /*global PriorityQueue */
  /**
   * @constructor
   * @class PriorityQueue manages a queue of elements with priorities. Default
   * is highest priority first.
   *
   * @param [options] If low is set to true returns lowest first.
   */
   var baseHeap;
   var sorted = false;
   
  function PriorityQueue()
  {
	baseHeap = new List.<KeyValuePair.<int, Object> >();
  }
    
    function heapifyUp(pos : int) {
      
      //var pos = baseHeap.Count - 1;
      if (!sorted)
      {
	      	if (pos >= baseHeap.Count) return -1;
	
	    // heap[i] have children heap[2*i + 1] and heap[2*i + 2] and parent heap[(i-1)/ 2];
	
	    while (pos > 0)
	    {
	        parentPos = (pos - 1) / 2;
	        if (baseHeap[parentPos].Key > baseHeap[pos].Key)
	        {
	            ExchangeElements(parentPos, pos);
	            pos = parentPos;
	        }
	        else break;
	    }
      }
      sorted = true;
      return pos;
    }
    
    function heapifyDown(pos : int)
    {
    	if (pos >= baseHeap.Count) return;
    
    // heap[i] have children heap[2*i + 1] and heap[2*i + 2] and parent heap[(i-1)/ 2];
    
	    while (true)
	    {
	        // on each iteration exchange element with its smallest child
	        var smallest = pos;
	        var left = 2 * pos + 1;
	        var right = 2 * pos + 2;
	        if (left < baseHeap.Count &&
	            baseHeap[smallest].Key > baseHeap[left].Key)
	            smallest = left;
	        if (right < baseHeap.Count &&
	            baseHeap[smallest].Key > baseHeap[right].Key)
	            smallest = right;
	            
	        if (smallest != pos)
	        {
	            ExchangeElements(smallest, pos);
	            pos = smallest;
	        }
	        else break;
	    }
    }

      function contains(object) : boolean {
		for (kvpair in baseHeap)
			{
				if (kvpair.Value.Equals(object))
					return true;
			}
		return false;
      }

      function size() {
        return baseHeap.Count;
      }

      function empty() {
        return size() == 0;
      }

      function push(my_object, my_priority) {
      	baseHeap.Add(new KeyValuePair.<int, Object>(my_priority, my_object));
      	heapifyUp(size() - 1);
      }
      
      function pop() : Object {
		var kvpair = baseHeap[0];
		baseHeap[0] = baseHeap[size() - 1];
		baseHeap.RemoveAt(size() - 1);
		heapifyDown(0);
		return kvpair.Value;
      }
      
      function ExchangeElements(pos1 : int, pos2 : int)
	  {
   		 val = baseHeap[pos1];
         baseHeap[pos1] = baseHeap[pos2];
    	 baseHeap[pos2] = val;
	  }
}