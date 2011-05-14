/*
 * object - オブジェクトを生成する
 * Object object(BaseObj [, mixinObj1 [, mixinObj2...]])
 */

function object(o) {
	var f = object.f, i, len, n, prop;
	f.prototype = o;
	n = new f;
	for (i=1, len=arguments.length; i<len; ++i){
		for (prop in arguments[i]){
			n[prop] = arguments[i][prop];
		}
	}
	return n;
}
object.f = function(){ };
