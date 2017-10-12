--- FUNCTION SOURCE (native collection.js:GetExistingHash) id{0,-1} start{1487} ---
(p){
if(%_IsSmi(p)){
return ComputeIntegerHash(p,0);
}
if((typeof(p)==='string')){
var u=%_StringGetRawHashField(p);
if((u&1)===0){
return u>>>2;
}
}else if((%_IsJSReceiver(p))&&!(%_IsJSProxy(p))&&!(%_ClassOf(p)==='global')){
var m=(p[f]);
return m;
}
return %GenericHash(p);
}
--- END ---
--- FUNCTION SOURCE (native collection.js:HashToEntry) id{1,-1} start{295} ---
(l,m,n){
var o=(m&((n)-1));
return((%_FixedArrayGet(l,(3+(o))|0)));
}
--- END ---
--- FUNCTION SOURCE (path.js:normalizeStringPosix) id{2,-1} start{3266} ---
(path, allowAboveRoot) {
  var res = '';
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47/*/*/)
      break;
    else
      code = 47/*/*/;
    if (code === 47/*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 ||
            res.charCodeAt(res.length - 1) !== 46/*.*/ ||
            res.charCodeAt(res.length - 2) !== 46/*.*/) {
          if (res.length > 2) {
            const start = res.length - 1;
            var j = start;
            for (; j >= 0; --j) {
              if (res.charCodeAt(j) === 47/*/*/)
                break;
            }
            if (j !== start) {
              if (j === -1)
                res = '';
              else
                res = res.slice(0, j);
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46/*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
--- END ---
--- FUNCTION SOURCE (native string.js:slice) id{3,-1} start{957} ---
(o,p){
if((%IS_VAR(this)===null)||(this===(void 0)))throw %make_type_error(17,"String.prototype.slice");
var g=(%_ToString(this));
var q=g.length;
var r=(%_ToInteger(o));
var s=q;
if(!(p===(void 0))){
s=(%_ToInteger(p));
}
if(r<0){
r+=q;
if(r<0){
r=0;
}
}else{
if(r>q){
return'';
}
}
if(s<0){
s+=q;
if(s<0){
return'';
}
}else{
if(s>q){
s=q;
}
}
if(s<=r){
return'';
}
return %_SubString(g,r,s);
}
--- END ---
--- FUNCTION SOURCE (native collection.js:get) id{4,-1} start{5153} ---
(p){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(46,
'Map.prototype.get',this);
}
var l=%_JSCollectionGetTable(this);
var n=((%_FixedArrayGet(l,(2)|0)));
var m=GetExistingHash(p);
if((m===(void 0)))return(void 0);
var q=MapFindEntry(l,n,p,m);
if(q===-1)return(void 0);
return((%_FixedArrayGet(l,((3+(n)+((q)*3))+1)|0)));
}
--- END ---
--- FUNCTION SOURCE (native collection.js:GetExistingHash) id{4,0} start{1487} ---
(p){
if(%_IsSmi(p)){
return ComputeIntegerHash(p,0);
}
if((typeof(p)==='string')){
var u=%_StringGetRawHashField(p);
if((u&1)===0){
return u>>>2;
}
}else if((%_IsJSReceiver(p))&&!(%_IsJSProxy(p))&&!(%_ClassOf(p)==='global')){
var m=(p[f]);
return m;
}
return %GenericHash(p);
}
--- END ---
INLINE (GetExistingHash) id{4,0} AS 0 AT <-1:5324>
--- FUNCTION SOURCE (native collection.js:MapFindEntry) id{4,1} start{856} ---
(l,n,p,m){
var q=HashToEntry(l,m,n);
if(q===-1)return q;
var r=((%_FixedArrayGet(l,((3+(n)+((q)*3)))|0)));
if(p===r)return q;
var s=(!%_IsSmi(%IS_VAR(p))&&!(p==p));
while(true){
if(s&&(!%_IsSmi(%IS_VAR(r))&&!(r==r))){
return q;
}
q=((%_FixedArrayGet(l,((3+(n)+((q)*3))+2)|0)));
if(q===-1)return q;
r=((%_FixedArrayGet(l,((3+(n)+((q)*3)))|0)));
if(p===r)return q;
}
return-1;
}
--- END ---
INLINE (MapFindEntry) id{4,1} AS 1 AT <-1:5384>
--- FUNCTION SOURCE (native collection.js:HashToEntry) id{4,2} start{295} ---
(l,m,n){
var o=(m&((n)-1));
return((%_FixedArrayGet(l,(3+(o))|0)));
}
--- END ---
INLINE (HashToEntry) id{4,2} AS 2 AT <1:873>
--- FUNCTION SOURCE (native array.js:ConvertToString) id{5,-1} start{2338} ---
(z,N){
if((N==null))return'';
return(%_ToString(z?N.toLocaleString():N));
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:baseGetTag) id{6,-1} start{100051} ---
(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      value = Object(value);
      return (symToStringTag && symToStringTag in value)
        ? getRawTag(value)
        : objectToString(value);
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:objectToString) id{6,0} start{216325} ---
(value) {
      return nativeObjectToString.call(value);
    }
--- END ---
INLINE (objectToString) id{6,0} AS 0 AT <-1:100280>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isFunction) id{7,-1} start{377938} ---
(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isObject) id{7,0} start{380511} ---
(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }
--- END ---
INLINE (isObject) id{7,0} AS 0 AT <-1:377959>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:baseGetTag) id{7,1} start{100051} ---
(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      value = Object(value);
      return (symToStringTag && symToStringTag in value)
        ? getRawTag(value)
        : objectToString(value);
    }
--- END ---
INLINE (baseGetTag) id{7,1} AS 1 AT <-1:378188>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:objectToString) id{7,2} start{216325} ---
(value) {
      return nativeObjectToString.call(value);
    }
--- END ---
INLINE (objectToString) id{7,2} AS 2 AT <1:100280>
--- FUNCTION SOURCE (path.js:_makeLong) id{8,-1} start{39872} ---
(path) {
    return path;
  }
--- END ---
--- FUNCTION SOURCE (fs.js:nextPart) id{9,-1} start{42541} ---
(p, i) { return p.indexOf('/', i); }
--- END ---
--- FUNCTION SOURCE (module.js:Module._resolveFilename) id{10,-1} start{14476} ---
(request, parent, isMain) {
  if (NativeModule.nonInternalExists(request)) {
    return request;
  }

  var paths = Module._resolveLookupPaths(request, parent, true);

  // look up the filename first, since that's the cache key.
  var filename = Module._findPath(request, paths, isMain);
  if (!filename) {
    var err = new Error(`Cannot find module '${request}'`);
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }
  return filename;
}
--- END ---
--- FUNCTION SOURCE (bootstrap_node.js:NativeModule.nonInternalExists) id{10,0} start{17345} ---
(id) {
      return NativeModule.exists(id) && !NativeModule.isInternal(id);
    }
--- END ---
INLINE (NativeModule.nonInternalExists) id{10,0} AS 0 AT <-1:14523>
--- FUNCTION SOURCE (bootstrap_node.js:NativeModule.exists) id{10,1} start{17016} ---
(id) {
    return NativeModule._source.hasOwnProperty(id);
  }
--- END ---
INLINE (NativeModule.exists) id{10,1} AS 1 AT <0:17378>
--- FUNCTION SOURCE (bootstrap_node.js:NativeModule.isInternal) id{10,2} start{17468} ---
(id) {
      return id.startsWith('internal/');
    }
--- END ---
INLINE (NativeModule.isInternal) id{10,2} AS 2 AT <0:17406>
--- FUNCTION SOURCE (fs.js:nullCheck) id{11,-1} start{5128} ---
(path, callback) {
  if (('' + path).indexOf('\x5cu0000') !== -1) {
    var er = new Error('Path must be a string without null bytes');
    er.code = 'ENOENT';
    if (typeof callback !== 'function')
      throw er;
    process.nextTick(callback, er);
    return false;
  }
  return true;
}
--- END ---
--- FUNCTION SOURCE (module.js:Module.require) id{12,-1} start{15506} ---
(path) {
  assert(path, 'missing path');
  assert(typeof path === 'string', 'path must be a string');
  return Module._load(path, this, /* isMain */ false);
}
--- END ---
--- FUNCTION SOURCE (assert.js:ok) id{12,0} start{3324} ---
(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
--- END ---
INLINE (ok) id{12,0} AS 0 AT <-1:15517>
INLINE (ok) id{12,0} AS 1 AT <-1:15549>
--- FUNCTION SOURCE (native collection.js:set) id{13,-1} start{5502} ---
(p,x){
if(!(%_ClassOf(this)==='Map')){
throw %make_type_error(46,
'Map.prototype.set',this);
}
if(p===0){
p=0;
}
var l=%_JSCollectionGetTable(this);
var n=((%_FixedArrayGet(l,(2)|0)));
var m=GetHash(p);
var q=MapFindEntry(l,n,p,m);
if(q!==-1){
var I=(3+(n)+((q)*3));
(%_FixedArraySet(l,(I+1)|0,x));
return this;
}
var y=((%_FixedArrayGet(l,(0)|0)));
var z=((%_FixedArrayGet(l,(1)|0)));
var A=n<<1;
if((y+z)>=A){
%MapGrow(this);
l=%_JSCollectionGetTable(this);
n=((%_FixedArrayGet(l,(2)|0)));
y=((%_FixedArrayGet(l,(0)|0)));
z=((%_FixedArrayGet(l,(1)|0)));
}
q=y+z;
var B=(3+(n)+((q)*3));
var o=(m&((n)-1));
var C=((%_FixedArrayGet(l,(3+(o))|0)));
((%_FixedArraySet(l,(3+(o))|0,q)));
(((%_FixedArraySet(l,(0)|0,(y+1)|0))));
(%_FixedArraySet(l,(B)|0,p));
(%_FixedArraySet(l,(B+1)|0,x));
(%_FixedArraySet(l,(B+2)|0,C));
return this;
}
--- END ---
--- FUNCTION SOURCE (native collection.js:GetHash) id{13,0} start{1819} ---
(p){
var m=GetExistingHash(p);
if((m===(void 0))){
m=(g()*0x40000000)|0;
if(m===0)m=1;
(p[f]=m);
}
return m;
}
--- END ---
INLINE (GetHash) id{13,0} AS 0 AT <-1:5693>
--- FUNCTION SOURCE (native collection.js:GetExistingHash) id{13,1} start{1487} ---
(p){
if(%_IsSmi(p)){
return ComputeIntegerHash(p,0);
}
if((typeof(p)==='string')){
var u=%_StringGetRawHashField(p);
if((u&1)===0){
return u>>>2;
}
}else if((%_IsJSReceiver(p))&&!(%_IsJSProxy(p))&&!(%_ClassOf(p)==='global')){
var m=(p[f]);
return m;
}
return %GenericHash(p);
}
--- END ---
INLINE (GetExistingHash) id{13,1} AS 1 AT <0:1830>
--- FUNCTION SOURCE (native collection.js:ComputeIntegerHash) id{13,2} start{1295} ---
(p,t){
var m=p;
m=m^t;
m=~m+(m<<15);
m=m^(m>>>12);
m=m+(m<<2);
m=m^(m>>>4);
m=(m*2057)|0;
m=m^(m>>>16);
return m&0x3fffffff;
}
--- END ---
INLINE (ComputeIntegerHash) id{13,2} AS 2 AT <1:1515>
--- FUNCTION SOURCE (native collection.js:MapFindEntry) id{13,3} start{856} ---
(l,n,p,m){
var q=HashToEntry(l,m,n);
if(q===-1)return q;
var r=((%_FixedArrayGet(l,((3+(n)+((q)*3)))|0)));
if(p===r)return q;
var s=(!%_IsSmi(%IS_VAR(p))&&!(p==p));
while(true){
if(s&&(!%_IsSmi(%IS_VAR(r))&&!(r==r))){
return q;
}
q=((%_FixedArrayGet(l,((3+(n)+((q)*3))+2)|0)));
if(q===-1)return q;
r=((%_FixedArrayGet(l,((3+(n)+((q)*3)))|0)));
if(p===r)return q;
}
return-1;
}
--- END ---
INLINE (MapFindEntry) id{13,3} AS 3 AT <-1:5711>
--- FUNCTION SOURCE (native collection.js:HashToEntry) id{13,4} start{295} ---
(l,m,n){
var o=(m&((n)-1));
return((%_FixedArrayGet(l,(3+(o))|0)));
}
--- END ---
INLINE (HashToEntry) id{13,4} AS 4 AT <3:873>
[deoptimizing (DEOPT eager): begin 0x31cbd920e2f9 <JS Function set (SharedFunctionInfo 0x34653da19b79)> (opt #13) @40, FP to SP delta: 192, caller sp: 0x7fff5fbfcbd0]
            ;;; deoptimize at -1_5597: not a heap number
  reading input frame set => node=74, args=3, height=12; inputs:
      0: 0x31cbd920e2f9 ; [fp - 16] 0x31cbd920e2f9 <JS Function set (SharedFunctionInfo 0x34653da19b79)>
      1: 0x178d08619061 ; [fp + 32] 0x178d08619061 <a Map with map 0x1c98d7e04ae9>
      2: 0x177627a1e0a9 ; [fp + 24] 0x177627a1e0a9 <String[63]: /Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js>
      3: 0x177627a1e0a9 ; [fp + 16] 0x177627a1e0a9 <String[63]: /Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js>
      4: 0x31cbd920d159 ; [fp - 24] 0x31cbd920d159 <FixedArray[14]>
      5: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
      6: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
      7: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
      8: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
      9: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
     10: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
     11: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
     12: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
     13: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
     14: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
     15: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
  translating frame set => node=74, height=88
    0x7fff5fbfcbc8: [top + 136] <- 0x178d08619061 ;  0x178d08619061 <a Map with map 0x1c98d7e04ae9>  (input #1)
    0x7fff5fbfcbc0: [top + 128] <- 0x177627a1e0a9 ;  0x177627a1e0a9 <String[63]: /Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js>  (input #2)
    0x7fff5fbfcbb8: [top + 120] <- 0x177627a1e0a9 ;  0x177627a1e0a9 <String[63]: /Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js>  (input #3)
    -------------------------
    0x7fff5fbfcbb0: [top + 112] <- 0x235ed17b87f0 ;  caller's pc
    0x7fff5fbfcba8: [top + 104] <- 0x7fff5fbfcc80 ;  caller's fp
    0x7fff5fbfcba0: [top + 96] <- 0x31cbd920d159 ;  context    0x31cbd920d159 <FixedArray[14]>  (input #4)
    0x7fff5fbfcb98: [top + 88] <- 0x31cbd920e2f9 ;  function    0x31cbd920e2f9 <JS Function set (SharedFunctionInfo 0x34653da19b79)>  (input #0)
    -------------------------
    0x7fff5fbfcb90: [top + 80] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #5)
    0x7fff5fbfcb88: [top + 72] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #6)
    0x7fff5fbfcb80: [top + 64] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #7)
    0x7fff5fbfcb78: [top + 56] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #8)
    0x7fff5fbfcb70: [top + 48] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #9)
    0x7fff5fbfcb68: [top + 40] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #10)
    0x7fff5fbfcb60: [top + 32] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #11)
    0x7fff5fbfcb58: [top + 24] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #12)
    0x7fff5fbfcb50: [top + 16] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #13)
    0x7fff5fbfcb48: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #14)
    0x7fff5fbfcb40: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #15)
[deoptimizing (eager): end 0x31cbd920e2f9 <JS Function set (SharedFunctionInfo 0x34653da19b79)> @40 => node=74, pc=0x235ed178ec91, caller sp=0x7fff5fbfcbd0, state=NO_REGISTERS, took 0.199 ms]
--- FUNCTION SOURCE (util.js:debugs.(anonymous function)) id{14,-1} start{4736} ---
() {}
--- END ---
--- FUNCTION SOURCE (bootstrap_node.js:NativeModule.exists) id{15,-1} start{17016} ---
(id) {
    return NativeModule._source.hasOwnProperty(id);
  }
--- END ---
--- FUNCTION SOURCE (module.js:stat) id{16,-1} start{1732} ---
(filename) {
  filename = path._makeLong(filename);
  const cache = stat.cache;
  if (cache !== null) {
    const result = cache.get(filename);
    if (result !== undefined) return result;
  }
  const result = internalModuleStat(filename);
  if (cache !== null) cache.set(filename, result);
  return result;
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{17,-1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{17,0} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{17,0} AS 0 AT <-1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{18,-1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{18,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{18,0} AS 0 AT <-1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{18,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{18,1} AS 1 AT <0:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:queueJobs) id{19,-1} start{21619} ---
() {
            var _this3 = this;

            var queuedJobs = this.jobs;

            // empty jobs
            this.jobs = [];

            // unqueue-method
            return function () {
                return _this3.jobs = _this3.jobs.concat(queuedJobs);
            };
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:) id{20,-1} start{21810} ---
() {
                return _this3.jobs = _this3.jobs.concat(queuedJobs);
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{21,-1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{22,-1} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{22,0} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{22,0} AS 0 AT <-1:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_loop) id{23,-1} start{12297} ---
() {
                var job = _this2.jobs[0];
                var remainingBuffer = _this2.streamBuffer.length - _this2.chunkOffset;

                if (job.type === 'push') {
                    // in strictObjectMode the variable being pushed has to be a real object.
                    // this prevents accidentaly pushing numbers, strings, etc.
                    if (_this2.options.strictObjectMode && typeof _this2.vars[job.name] !== 'undefined' && !(0, _lodash.isPlainObject)(_this2.vars[job.name])) {
                        throw new TypeError('Can\x5c't push into a non-object value (' + job.name + ') in strictObjectMode');
                    }

                    _this2.jobs.shift();
                    _this2.varStack.push(job.name, job.value);
                    return 'continue';
                } else if (job.type === 'pop') {
                    _this2.jobs.shift();
                    _this2.varStack.pop();
                    return 'continue';
                } else if (job.type === 'tap') {
                    _this2.jobs.shift();

                    var unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        // if the tap has a name, push a new var-layer
                        _this2.push(job.name).tap(job.callback, job.args).pop();
                    } else {
                        // otherwise we continue working on the current layer
                        job.callback.apply(_this2, job.args);
                    }

                    unqueue();
                    return 'continue';
                } else if (job.type === 'loop') {
                    // wait for more data before executing a loop on an empty buffer.
                    // this way empty objects are not being added when the stream finishes
                    if (remainingBuffer === 0) {
                        return 'break';
                    }

                    if (job.finished) {
                        _this2.jobs.shift();
                        return 'continue';
                    }

                    var loopIdentifier = _this2.options.loopIdentifier;
                    var _unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        if (typeof _this2.vars[job.name] === 'undefined') {
                            _this2.vars[job.name] = [];
                        }

                        _this2.tap(loopIdentifier, job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        });
                    } else {
                        // make copy, in case the user discards the result
                        // {@link CorrodeBase#options.anonymousLoopDiscardDeep}
                        if (_this2.options.anonymousLoopDiscardDeep) {
                            job[loopIdentifier] = (0, _lodash.cloneDeep)(_this2.vars);
                        } else {
                            job[loopIdentifier] = _extends({}, _this2.vars);
                        }

                        _this2.tap(job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            if (job.discarded && typeof job[loopIdentifier] !== 'undefined') {
                                this.vars = job[loopIdentifier];
                            }
                            job.discarded = false;
                            delete job[loopIdentifier];
                        });
                    }

                    _unqueue();
                    return 'continue';
                }

                // determine length of next job
                var length = typeof job.length === 'string' ? _this2.vars[job.length] : job.length;

                // only valid numbers can be used as length
                if (typeof length !== 'number') {
                    throw new TypeError('Cannot find a valid length for job ' + job.name + ', dereferenced length is ' + JSON.stringify(length));
                }

                // break on unsufficient streamBuffer-length (wait if not unwinding yet)
                if (_this2.streamBuffer.length - _this2.chunkOffset < length) {
                    if (_this2.isUnwinding && _this2.jobs.length > 0) {
                        // unwind loop, by removing the loop job
                        _this2.removeReadJobs();
                        return 'continue';
                    }

                    return 'break';
                }

                if (job.type === 'buffer') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.slice(_this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'string') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.toString(job.encoding, _this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'skip') {
                    _this2.jobs.shift();
                    if (_this2.streamOffset + length < 0) {
                        throw new RangeError('cannot skip below 0');
                    }
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (typeof _this2.primitveMap[job.type] === 'function') {
                    _this2.vars[job.name] = _this2.primitveMap[job.type](job);
                    _this2.jobs.shift();
                    _this2._moveOffset(length);
                } else {
                    throw new Error('invalid job type \x5c'' + job.type + '\x5c'');
                }
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{23,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{23,0} AS 0 AT <-1:12721>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{23,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{23,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:push) id{23,2} start{6808} ---
(name) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (typeof this.value[name] === 'undefined') {
                // only push new value if there's no old one
                this.value[name] = value;
            } else {
                // otherwise re-push the current one
                value = this.value[name];
            }

            var index = this.stack.push(new VariableStackLayer(value, false, name));
            this.top = this.stack[index - 1];
        }
--- END ---
INLINE (push) id{23,2} AS 2 AT <-1:13033>
INLINE (get) id{23,1} AS 3 AT <2:6941>
INLINE (get) id{23,1} AS 4 AT <2:7054>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:VariableStackLayer) id{23,3} start{918} ---
() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, VariableStackLayer);

    this.isRoot = false;
    this.value = {};
    this.name = null;

    this.value = value;
    this.isRoot = isRoot;
    this.name = name;
}
--- END ---
INLINE (VariableStackLayer) id{23,3} AS 5 AT <2:7247>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:_classCallCheck) id{23,4} start{735} ---
(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
--- END ---
INLINE (_classCallCheck) id{23,4} AS 6 AT <5:1197>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:pop) id{23,5} start{7550} ---
() {
            var popLayer = this.top;
            if (popLayer.isRoot) {
                throw new ReferenceError('can\x5c't pop root layer');
            }

            this.stack.pop();

            this.top = this.stack[this.stack.length - 1];

            // reassure that the value in the layer above is right
            // (in case of non-object values)
            this.value[popLayer.name] = popLayer.value;
        }
--- END ---
INLINE (pop) id{23,5} AS 7 AT <-1:13225>
INLINE (get) id{23,1} AS 8 AT <7:7928>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:push) id{23,6} start{27041} ---
(name, value) {
            return this._pushJob({
                type: 'push',
                name: name,
                value: value
            });
        }
--- END ---
INLINE (push) id{23,6} AS 9 AT <-1:13578>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{23,7} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{23,7} AS 10 AT <9:27081>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{23,8} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{23,8} AS 11 AT <10:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{23,9} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{23,9} AS 12 AT <-1:13593>
INLINE (_pushJob) id{23,7} AS 13 AT <12:23325>
INLINE (_typeof) id{23,8} AS 14 AT <13:22236>
[deoptimizing (DEOPT soft): begin 0x1de96d930f71 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)> (opt #23) @120, FP to SP delta: 288, caller sp: 0x7fff5fbf4e90]
            ;;; deoptimize at -1_14299: Insufficient type feedback for generic named access
  reading input frame _loop => node=613, args=1, height=6; inputs:
      0: 0x1de96d930f71 ; [fp - 16] 0x1de96d930f71 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>
      1: 0x34653da02311 ; [fp + 16] 0x34653da02311 <undefined>
      2: 0x8496b91cca1 ; rax 0x8496b91cca1 <FixedArray[6]>
      3: 64528 ; (int) [fp - 32] 
      4: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      5: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      6: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      7: 0x34653da04aa9 ; (literal 22) 0x34653da04aa9 <Odd Oddball: optimized_out>
  translating frame _loop => node=613, height=40
    0x7fff5fbf4e88: [top + 72] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #1)
    -------------------------
    0x7fff5fbf4e80: [top + 64] <- 0x235ed18494c1 ;  caller's pc
    0x7fff5fbf4e78: [top + 56] <- 0x7fff5fbf4ec8 ;  caller's fp
    0x7fff5fbf4e70: [top + 48] <- 0x8496b91cca1 ;  context    0x8496b91cca1 <FixedArray[6]>  (input #2)
    0x7fff5fbf4e68: [top + 40] <- 0x1de96d930f71 ;  function    0x1de96d930f71 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>  (input #0)
    -------------------------
    0x7fff5fbf4e60: [top + 32] <- 0xfc1000000000 ;  64528  (input #3)
    0x7fff5fbf4e58: [top + 24] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #4)
    0x7fff5fbf4e50: [top + 16] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #5)
    0x7fff5fbf4e48: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #6)
    0x7fff5fbf4e40: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #7)
[deoptimizing (soft): end 0x1de96d930f71 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)> @120 => node=613, pc=0x235ed184a155, caller sp=0x7fff5fbf4e90, state=NO_REGISTERS, took 0.063 ms]
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:pop) id{24,-1} start{26390} ---
() {
            return this._pushJob({
                type: 'pop'
            });
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{24,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{24,0} AS 0 AT <-1:26419>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{24,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{24,1} AS 1 AT <0:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:_classCallCheck) id{25,-1} start{735} ---
(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:push) id{26,-1} start{27041} ---
(name, value) {
            return this._pushJob({
                type: 'push',
                name: name,
                value: value
            });
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{26,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{26,0} AS 0 AT <-1:27081>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{26,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{26,1} AS 1 AT <0:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:pop) id{27,-1} start{7550} ---
() {
            var popLayer = this.top;
            if (popLayer.isRoot) {
                throw new ReferenceError('can\x5c't pop root layer');
            }

            this.stack.pop();

            this.top = this.stack[this.stack.length - 1];

            // reassure that the value in the layer above is right
            // (in case of non-object values)
            this.value[popLayer.name] = popLayer.value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{27,0} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{27,0} AS 0 AT <-1:7928>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_loop) id{28,-1} start{12297} ---
() {
                var job = _this2.jobs[0];
                var remainingBuffer = _this2.streamBuffer.length - _this2.chunkOffset;

                if (job.type === 'push') {
                    // in strictObjectMode the variable being pushed has to be a real object.
                    // this prevents accidentaly pushing numbers, strings, etc.
                    if (_this2.options.strictObjectMode && typeof _this2.vars[job.name] !== 'undefined' && !(0, _lodash.isPlainObject)(_this2.vars[job.name])) {
                        throw new TypeError('Can\x5c't push into a non-object value (' + job.name + ') in strictObjectMode');
                    }

                    _this2.jobs.shift();
                    _this2.varStack.push(job.name, job.value);
                    return 'continue';
                } else if (job.type === 'pop') {
                    _this2.jobs.shift();
                    _this2.varStack.pop();
                    return 'continue';
                } else if (job.type === 'tap') {
                    _this2.jobs.shift();

                    var unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        // if the tap has a name, push a new var-layer
                        _this2.push(job.name).tap(job.callback, job.args).pop();
                    } else {
                        // otherwise we continue working on the current layer
                        job.callback.apply(_this2, job.args);
                    }

                    unqueue();
                    return 'continue';
                } else if (job.type === 'loop') {
                    // wait for more data before executing a loop on an empty buffer.
                    // this way empty objects are not being added when the stream finishes
                    if (remainingBuffer === 0) {
                        return 'break';
                    }

                    if (job.finished) {
                        _this2.jobs.shift();
                        return 'continue';
                    }

                    var loopIdentifier = _this2.options.loopIdentifier;
                    var _unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        if (typeof _this2.vars[job.name] === 'undefined') {
                            _this2.vars[job.name] = [];
                        }

                        _this2.tap(loopIdentifier, job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        });
                    } else {
                        // make copy, in case the user discards the result
                        // {@link CorrodeBase#options.anonymousLoopDiscardDeep}
                        if (_this2.options.anonymousLoopDiscardDeep) {
                            job[loopIdentifier] = (0, _lodash.cloneDeep)(_this2.vars);
                        } else {
                            job[loopIdentifier] = _extends({}, _this2.vars);
                        }

                        _this2.tap(job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            if (job.discarded && typeof job[loopIdentifier] !== 'undefined') {
                                this.vars = job[loopIdentifier];
                            }
                            job.discarded = false;
                            delete job[loopIdentifier];
                        });
                    }

                    _unqueue();
                    return 'continue';
                }

                // determine length of next job
                var length = typeof job.length === 'string' ? _this2.vars[job.length] : job.length;

                // only valid numbers can be used as length
                if (typeof length !== 'number') {
                    throw new TypeError('Cannot find a valid length for job ' + job.name + ', dereferenced length is ' + JSON.stringify(length));
                }

                // break on unsufficient streamBuffer-length (wait if not unwinding yet)
                if (_this2.streamBuffer.length - _this2.chunkOffset < length) {
                    if (_this2.isUnwinding && _this2.jobs.length > 0) {
                        // unwind loop, by removing the loop job
                        _this2.removeReadJobs();
                        return 'continue';
                    }

                    return 'break';
                }

                if (job.type === 'buffer') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.slice(_this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'string') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.toString(job.encoding, _this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'skip') {
                    _this2.jobs.shift();
                    if (_this2.streamOffset + length < 0) {
                        throw new RangeError('cannot skip below 0');
                    }
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (typeof _this2.primitveMap[job.type] === 'function') {
                    _this2.vars[job.name] = _this2.primitveMap[job.type](job);
                    _this2.jobs.shift();
                    _this2._moveOffset(length);
                } else {
                    throw new Error('invalid job type \x5c'' + job.type + '\x5c'');
                }
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{28,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{28,0} AS 0 AT <-1:12721>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{28,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{28,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:push) id{28,2} start{6808} ---
(name) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (typeof this.value[name] === 'undefined') {
                // only push new value if there's no old one
                this.value[name] = value;
            } else {
                // otherwise re-push the current one
                value = this.value[name];
            }

            var index = this.stack.push(new VariableStackLayer(value, false, name));
            this.top = this.stack[index - 1];
        }
--- END ---
INLINE (push) id{28,2} AS 2 AT <-1:13033>
INLINE (get) id{28,1} AS 3 AT <2:6941>
INLINE (get) id{28,1} AS 4 AT <2:7054>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:VariableStackLayer) id{28,3} start{918} ---
() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, VariableStackLayer);

    this.isRoot = false;
    this.value = {};
    this.name = null;

    this.value = value;
    this.isRoot = isRoot;
    this.name = name;
}
--- END ---
INLINE (VariableStackLayer) id{28,3} AS 5 AT <2:7247>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:_classCallCheck) id{28,4} start{735} ---
(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
--- END ---
INLINE (_classCallCheck) id{28,4} AS 6 AT <5:1197>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:pop) id{28,5} start{7550} ---
() {
            var popLayer = this.top;
            if (popLayer.isRoot) {
                throw new ReferenceError('can\x5c't pop root layer');
            }

            this.stack.pop();

            this.top = this.stack[this.stack.length - 1];

            // reassure that the value in the layer above is right
            // (in case of non-object values)
            this.value[popLayer.name] = popLayer.value;
        }
--- END ---
INLINE (pop) id{28,5} AS 7 AT <-1:13225>
INLINE (get) id{28,1} AS 8 AT <7:7928>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:push) id{28,6} start{27041} ---
(name, value) {
            return this._pushJob({
                type: 'push',
                name: name,
                value: value
            });
        }
--- END ---
INLINE (push) id{28,6} AS 9 AT <-1:13578>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{28,7} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{28,7} AS 10 AT <9:27081>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{28,8} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{28,8} AS 11 AT <10:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{28,9} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{28,9} AS 12 AT <-1:13593>
INLINE (_pushJob) id{28,7} AS 13 AT <12:23325>
INLINE (_typeof) id{28,8} AS 14 AT <13:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_moveOffset) id{29,-1} start{20448} ---
(by) {
            this.chunkOffset += by;
            /**
             * offset in the whole piped stream
             * @access public
             * @type {Number}
             */
            this.streamOffset += by;
        }
--- END ---
--- FUNCTION SOURCE (buffer.js:slice) id{30,-1} start{27886} ---
(start, end) {
  const srcLength = this.length;
  start = adjustOffset(start, srcLength);
  end = end !== undefined ? adjustOffset(end, srcLength) : srcLength;
  const newLength = end > start ? end - start : 0;
  return new FastBuffer(this.buffer, this.byteOffset + start, newLength);
}
--- END ---
--- FUNCTION SOURCE (buffer.js:adjustOffset) id{30,0} start{27374} ---
(offset, length) {
  // Use Math.trunc() to convert offset to an integer value that can be larger
  // than an Int32. Hence, don't use offset | 0 or similar techniques.
  offset = Math.trunc(offset);
  // `x !== x`-style conditionals are a faster form of `isNaN(x)`
  if (offset === 0 || offset !== offset) {
    return 0;
  } else if (offset < 0) {
    offset += length;
    return offset > 0 ? offset : 0;
  } else {
    return offset < length ? offset : length;
  }
}
--- END ---
INLINE (adjustOffset) id{30,0} AS 0 AT <-1:27944>
INLINE (adjustOffset) id{30,0} AS 1 AT <-1:28004>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:slice) id{31,-1} start{2389} ---
(start, end) {
  return this.copy(null, 0, start, end)
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:set) id{32,-1} start{6093} ---
(val) {
            this.varStack.value = val;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:set) id{32,0} start{8646} ---
(val) {
            if (!this.top.isRoot) {
                this.peek()[this.top.name] = val;
            }
            this.top.value = val;
        }
--- END ---
INLINE (set) id{32,0} AS 0 AT <-1:6133>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{32,1} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
INLINE (peek) id{32,1} AS 1 AT <0:8711>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{32,2} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{32,2} AS 2 AT <1:5576>
--- FUNCTION SOURCE (native runtime.js:ToIndex) id{33,-1} start{265} ---
(h,i){
var j=(%_ToInteger(h))+0;
if(j<0||j>9007199254740991)throw %make_range_error(i);
return j;
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/map/index.js:push) id{34,-1} start{6800} ---
() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'values';

  this.vars = this.vars[name];
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{34,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{34,0} AS 0 AT <-1:6915>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{34,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{34,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:set) id{34,2} start{6093} ---
(val) {
            this.varStack.value = val;
        }
--- END ---
INLINE (set) id{34,2} AS 2 AT <-1:6909>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:set) id{34,3} start{8646} ---
(val) {
            if (!this.top.isRoot) {
                this.peek()[this.top.name] = val;
            }
            this.top.value = val;
        }
--- END ---
INLINE (set) id{34,3} AS 3 AT <2:6133>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{34,4} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
INLINE (peek) id{34,4} AS 4 AT <3:8711>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{34,5} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{34,5} AS 5 AT <4:5576>
--- FUNCTION SOURCE (buffer.js:checkOffset) id{35,-1} start{28196} ---
(offset, ext, length) {
  if (offset + ext > length)
    throw new RangeError('Index out of range');
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{36,-1} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{36,0} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{36,0} AS 0 AT <-1:5576>
--- FUNCTION SOURCE (native runtime.js:MinSimple) id{37,-1} start{426} ---
(k,l){
return k>l?l:k;
}
--- END ---
--- FUNCTION SOURCE (native typedarray.js:Uint8ArrayConstructByArrayBuffer) id{38,-1} start{1947} ---
(Z,aa,ab,ac){
if(!(ab===(void 0))){
ab=C(ab,171);
}
if(!(ac===(void 0))){
ac=C(ac,171);
}
if(ac>%_MaxSmi()){
throw %make_range_error(171);
}
var ad=%_ArrayBufferGetByteLength(aa);
var ae;
if((ab===(void 0))){
ae=0;
}else{
ae=ab;
if(ae % 1!==0){
throw %make_range_error(169,
"start offset","Uint8Array",1);
}
}
var af;
if((ac===(void 0))){
if(ad % 1!==0){
throw %make_range_error(169,
"byte length","Uint8Array",1);
}
af=ad-ae;
if(af<0){
throw %make_range_error(162,ae);
}
}else{
af=ac*1;
if(ae+af>ad){
throw %make_range_error(171);
}
}
%_TypedArrayInitialize(Z,1,aa,ae,af,true);
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isObjectLike) id{39,-1} start{381249} ---
(value) {
      return value != null && typeof value == 'object';
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:) id{40,-1} start{14848} ---
() {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{40,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{40,0} AS 0 AT <-1:14902>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{40,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{40,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isPlainObject) id{40,2} start{388785} ---
(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }
--- END ---
INLINE (isPlainObject) id{40,2} AS 2 AT <-1:15149>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isObjectLike) id{40,3} start{381249} ---
(value) {
      return value != null && typeof value == 'object';
    }
--- END ---
INLINE (isObjectLike) id{40,3} AS 3 AT <2:388806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:baseGetTag) id{40,4} start{100051} ---
(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      value = Object(value);
      return (symToStringTag && symToStringTag in value)
        ? getRawTag(value)
        : objectToString(value);
    }
--- END ---
INLINE (baseGetTag) id{40,4} AS 4 AT <2:388829>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:objectToString) id{40,5} start{216325} ---
(value) {
      return nativeObjectToString.call(value);
    }
--- END ---
INLINE (objectToString) id{40,5} AS 5 AT <4:100280>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:) id{40,6} start{40985} ---
(arg) {
      return func(transform(arg));
    }
--- END ---
INLINE () id{40,6} AS 6 AT <2:388911>
INLINE (get) id{40,0} AS 7 AT <-1:15240>
INLINE (get) id{40,1} AS 8 AT <7:5032>
INLINE (get) id{40,0} AS 9 AT <-1:15394>
INLINE (get) id{40,1} AS 10 AT <9:5032>
--- FUNCTION SOURCE (native typedarray.js:get [Symbol.toStringTag]) id{41,-1} start{29422} ---
(){
if(!(%_IsTypedArray(this)))return;
var aN=%_ClassOf(this);
if((aN===(void 0)))return;
return aN;
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{42,-1} start{220} ---
(type, elementCount) {
    this
        .buffer('buffer', elementCount * type.BYTES_PER_ELEMENT)
        .tap(function () {
        const buffer = this.vars.buffer;
        this.vars.array = new type(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    })
        .map.push('array');
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:buffer) id{42,0} start{27862} ---
(name, length) {
            return this._pushJob({
                name: name,
                type: 'buffer',
                length: length
            });
        }
--- END ---
INLINE (buffer) id{42,0} AS 0 AT <-1:261>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{42,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{42,1} AS 1 AT <0:27903>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{42,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{42,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{42,3} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{42,3} AS 3 AT <-1:326>
INLINE (_pushJob) id{42,1} AS 4 AT <3:23325>
INLINE (_typeof) id{42,2} AS 5 AT <4:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{42,4} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{42,4} AS 6 AT <-1:520>
INLINE (tap) id{42,3} AS 7 AT <6:806>
INLINE (_pushJob) id{42,1} AS 8 AT <7:23325>
INLINE (_typeof) id{42,2} AS 9 AT <8:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{43,-1} start{339} ---
() {
        const buffer = this.vars.buffer;
        this.vars.array = new type(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{43,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{43,0} AS 0 AT <-1:371>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{43,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{43,1} AS 1 AT <0:5032>
INLINE (get) id{43,0} AS 2 AT <-1:397>
INLINE (get) id{43,1} AS 3 AT <2:5032>
--- FUNCTION SOURCE (native runtime.js:SpeciesConstructor) id{44,-1} start{542} ---
(m,n){
var o=m.constructor;
if((o===(void 0))){
return n;
}
if(!(%_IsJSReceiver(o))){
throw %make_type_error(28);
}
var p=o[f];
if((p==null)){
return n;
}
if(%IsConstructor(p)){
return p;
}
throw %make_type_error(236);
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{45,-1} start{718} ---
() {
    this
        .ext.nativeArray('vec3', Float32Array, 3)
        .map.push('vec3');
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{45,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{45,0} AS 0 AT <-1:795>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{45,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{45,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{45,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{45,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{45,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{45,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint32) id{46,-1} start{35189} ---
(name) {
            return this._pushJob(name, 'uint32', 4, this.options.endianness);
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{46,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{46,0} AS 0 AT <-1:35222>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{46,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{46,1} AS 1 AT <0:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint32) id{47,-1} start{8739} ---
(job) {
                return _this.streamBuffer['readUInt32' + job.endianness](_this.chunkOffset);
            }
--- END ---
--- FUNCTION SOURCE (buffer.js:Buffer.readUInt32LE) id{48,-1} start{29619} ---
(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert)
    checkOffset(offset, 4, this.length);

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000);
}
--- END ---
--- FUNCTION SOURCE (buffer.js:checkOffset) id{48,0} start{28196} ---
(offset, ext, length) {
  if (offset + ext > length)
    throw new RangeError('Index out of range');
}
--- END ---
INLINE (checkOffset) id{48,0} AS 0 AT <-1:29686>
[deoptimizing (DEOPT eager): begin 0x158efe7d9409 <JS Function push (SharedFunctionInfo 0x153f56782621)> (opt #34) @25, FP to SP delta: 64, caller sp: 0x7fff5fbf4d30]
            ;;; deoptimize at 3_8781: Smi
  reading input frame push => node=74, args=1, height=3; inputs:
      0: 0x158efe7d9409 ; [fp - 16] 0x158efe7d9409 <JS Function push (SharedFunctionInfo 0x153f56782621)>
      1: 0x38f392d96b81 ; [fp + 16] 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x158efe7e6559 ; [fp - 24] 0x158efe7e6559 <FixedArray[5]>
      3: 0x34653da04aa9 ; (literal 14) 0x34653da04aa9 <Odd Oddball: optimized_out>
      4: 0x34653da04aa9 ; (literal 14) 0x34653da04aa9 <Odd Oddball: optimized_out>
  reading setter frame push; inputs:
      0: 0x158efe782ad9 ; (literal 19) 0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)>
      1: 0x38f392d96b81 ; [fp + 16] 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0xffffffff00000000 ; rdx -1
  reading input frame set => node=16, args=2, height=2; inputs:
      0: 0x158efe782ad9 ; (literal 19) 0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)>
      1: 0x38f392d96b81 ; [fp + 16] 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0xffffffff00000000 ; rdx -1
      3: 0x26ac53f7a179 ; (literal 16) 0x26ac53f7a179 <FixedArray[5]>
      4: 0x34653da04aa9 ; (literal 14) 0x34653da04aa9 <Odd Oddball: optimized_out>
  reading setter frame push; inputs:
      0: 0x153f567b1911 ; (literal 20) 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
      1: 0x38f392dd61c1 ; rax 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0xffffffff00000000 ; rdx -1
  reading input frame set => node=14, args=2, height=2; inputs:
      0: 0x153f567b1911 ; (literal 20) 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
      1: 0x38f392dd61c1 ; rax 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0xffffffff00000000 ; rdx -1
      3: 0x153f567d9761 ; (literal 18) 0x153f567d9761 <FixedArray[5]>
      4: 0x153f567b1911 ; (literal 20) 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
  translating frame push => node=74, height=16
    0x7fff5fbf4d28: [top + 48] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4d20: [top + 40] <- 0x235ed160579b ;  caller's pc
    0x7fff5fbf4d18: [top + 32] <- 0x7fff5fbf4d48 ;  caller's fp
    0x7fff5fbf4d10: [top + 24] <- 0x158efe7e6559 ;  context    0x158efe7e6559 <FixedArray[5]>  (input #2)
    0x7fff5fbf4d08: [top + 16] <- 0x158efe7d9409 ;  function    0x158efe7d9409 <JS Function push (SharedFunctionInfo 0x153f56782621)>  (input #0)
    -------------------------
    0x7fff5fbf4d00: [top + 8] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
    0x7fff5fbf4cf8: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #4)
  translating setter stub => height=0
    0x7fff5fbf4cf0: [top + 40] <- 0x235ed18565a2 ;  caller's pc
    0x7fff5fbf4ce8: [top + 32] <- 0x7fff5fbf4d18 ;  caller's fp
    0x7fff5fbf4ce0: [top + 24] <- 0x0000001a ;  frame type (setter sentinel)
    0x7fff5fbf4cd8: [top + 16] <- 0x235ed16c7d41 ;  code object
    0x7fff5fbf4cd0: [top + 8] <- 0x158efe7e6559 ;  context
    0x7fff5fbf4cc8: [top + 0] <- 0xffffffff00000000 ;  -1  (input #2)
  translating frame set => node=16, height=8
    0x7fff5fbf4cc0: [top + 48] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    0x7fff5fbf4cb8: [top + 40] <- 0xffffffff00000000 ;  -1  (input #2)
    -------------------------
    0x7fff5fbf4cb0: [top + 32] <- 0x235ed16c7db4 ;  caller's pc
    0x7fff5fbf4ca8: [top + 24] <- 0x7fff5fbf4ce8 ;  caller's fp
    0x7fff5fbf4ca0: [top + 16] <- 0x26ac53f7a179 ;  context    0x26ac53f7a179 <FixedArray[5]>  (input #3)
    0x7fff5fbf4c98: [top + 8] <- 0x158efe782ad9 ;  function    0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)>  (input #0)
    -------------------------
    0x7fff5fbf4c90: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #4)
  translating setter stub => height=0
    0x7fff5fbf4c88: [top + 40] <- 0x235ed18500b3 ;  caller's pc
    0x7fff5fbf4c80: [top + 32] <- 0x7fff5fbf4ca8 ;  caller's fp
    0x7fff5fbf4c78: [top + 24] <- 0x0000001a ;  frame type (setter sentinel)
    0x7fff5fbf4c70: [top + 16] <- 0x235ed16c7d41 ;  code object
    0x7fff5fbf4c68: [top + 8] <- 0x26ac53f7a179 ;  context
    0x7fff5fbf4c60: [top + 0] <- 0xffffffff00000000 ;  -1  (input #2)
  translating frame set => node=14, height=8
    0x7fff5fbf4c58: [top + 48] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    0x7fff5fbf4c50: [top + 40] <- 0xffffffff00000000 ;  -1  (input #2)
    -------------------------
    0x7fff5fbf4c48: [top + 32] <- 0x235ed16c7db4 ;  caller's pc
    0x7fff5fbf4c40: [top + 24] <- 0x7fff5fbf4c80 ;  caller's fp
    0x7fff5fbf4c38: [top + 16] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #3)
    0x7fff5fbf4c30: [top + 8] <- 0x153f567b1911 ;  function    0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>  (input #0)
    -------------------------
    0x7fff5fbf4c28: [top + 0] <- 0x153f567b1911 ;  0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>  (input #4)
[deoptimizing (eager): end 0x158efe7d9409 <JS Function push (SharedFunctionInfo 0x153f56782621)> @25 => node=14, pc=0x235ed1850282, caller sp=0x7fff5fbf4d30, state=NO_REGISTERS, took 0.183 ms]
[marking dependent code 0x235ed1864181 (opt #23) for deoptimization, reason: transition]
[marking dependent code 0x235ed186b5c1 (opt #28) for deoptimization, reason: transition]
[deoptimize marked code in all contexts]
[deoptimizer unlinked: _loop / 38f392d96be9]
[deoptimizing (DEOPT lazy): begin 0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)> (opt #28) @180, FP to SP delta: 272, caller sp: 0x7fff5fbf4e90]
  reading input frame _loop => node=532, args=1, height=6; inputs:
      0: 0x38f392d96be9 ; [fp - 16] 0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>
      1: 0x34653da02311 ; [fp + 16] 0x34653da02311 <undefined>
      2: 0x1de96d911209 ; [fp - 24] 0x1de96d911209 <FixedArray[6]>
      3: 0x34653da04aa9 ; (literal 22) 0x34653da04aa9 <Odd Oddball: optimized_out>
      4: 0x1de96d9112a9 ; [fp - 40] 0x1de96d9112a9 <JS Function (SharedFunctionInfo 0x26ac53f43da1)>
      5: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      6: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      7: 0x34653da04aa9 ; (literal 22) 0x34653da04aa9 <Odd Oddball: optimized_out>
  translating frame _loop => node=532, height=40
    0x7fff5fbf4e88: [top + 72] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #1)
    -------------------------
    0x7fff5fbf4e80: [top + 64] <- 0x235ed18494c1 ;  caller's pc
    0x7fff5fbf4e78: [top + 56] <- 0x7fff5fbf4ec8 ;  caller's fp
    0x7fff5fbf4e70: [top + 48] <- 0x1de96d911209 ;  context    0x1de96d911209 <FixedArray[6]>  (input #2)
    0x7fff5fbf4e68: [top + 40] <- 0x38f392d96be9 ;  function    0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>  (input #0)
    -------------------------
    0x7fff5fbf4e60: [top + 32] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
    0x7fff5fbf4e58: [top + 24] <- 0x1de96d9112a9 ;  0x1de96d9112a9 <JS Function (SharedFunctionInfo 0x26ac53f43da1)>  (input #4)
    0x7fff5fbf4e50: [top + 16] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #5)
    0x7fff5fbf4e48: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #6)
    0x7fff5fbf4e40: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #7)
[deoptimizing (lazy): end 0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)> @180 => node=532, pc=0x235ed184a063, caller sp=0x7fff5fbf4e90, state=NO_REGISTERS, took 0.069 ms]
[deoptimizing (DEOPT eager): begin 0x153f567e1ec9 <JS Function pop (SharedFunctionInfo 0x3e7fc7a4bfe9)> (opt #27) @3, FP to SP delta: 32, caller sp: 0x7fff5fbf4e38]
            ;;; deoptimize at -1_7616: wrong map
  reading input frame pop => node=4, args=1, height=3; inputs:
      0: 0x153f567e1ec9 ; [fp - 16] 0x153f567e1ec9 <JS Function pop (SharedFunctionInfo 0x3e7fc7a4bfe9)>
      1: 0x38f392dd61c1 ; r9 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; [fp - 24] 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da02311 ; (literal 3) 0x34653da02311 <undefined>
      4: 0x34653da02311 ; (literal 3) 0x34653da02311 <undefined>
  translating frame pop => node=4, height=16
    0x7fff5fbf4e30: [top + 48] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4e28: [top + 40] <- 0x235ed1849cf8 ;  caller's pc
    0x7fff5fbf4e20: [top + 32] <- 0x7fff5fbf4e78 ;  caller's fp
    0x7fff5fbf4e18: [top + 24] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4e10: [top + 16] <- 0x153f567e1ec9 ;  function    0x153f567e1ec9 <JS Function pop (SharedFunctionInfo 0x3e7fc7a4bfe9)>  (input #0)
    -------------------------
    0x7fff5fbf4e08: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
    0x7fff5fbf4e00: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #4)
[deoptimizing (eager): end 0x153f567e1ec9 <JS Function pop (SharedFunctionInfo 0x3e7fc7a4bfe9)> @3 => node=4, pc=0x235ed1850938, caller sp=0x7fff5fbf4e38, state=NO_REGISTERS, took 0.049 ms]
[deoptimizing (DEOPT eager): begin 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)> (opt #22) @3, FP to SP delta: 24, caller sp: 0x7fff5fbf4e18]
            ;;; deoptimize at 0_8429: wrong map
  reading input frame get => node=16, args=1, height=2; inputs:
      0: 0x158efe782a91 ; [fp - 16] 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>
      1: 0x38f392d96b81 ; rax 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x26ac53f7a179 ; [fp - 24] 0x26ac53f7a179 <FixedArray[5]>
      3: 0x34653da04aa9 ; (literal 4) 0x34653da04aa9 <Odd Oddball: optimized_out>
  reading getter frame get; inputs:
      0: 0x153f567b18c9 ; (literal 5) 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rbx 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
  reading input frame get => node=3, args=1, height=2; inputs:
      0: 0x153f567b18c9 ; (literal 5) 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rbx 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; (literal 6) 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da02311 ; (literal 3) 0x34653da02311 <undefined>
  translating frame get => node=16, height=8
    0x7fff5fbf4e10: [top + 40] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4e08: [top + 32] <- 0x235ed184d4a7 ;  caller's pc
    0x7fff5fbf4e00: [top + 24] <- 0x7fff5fbf4e30 ;  caller's fp
    0x7fff5fbf4df8: [top + 16] <- 0x26ac53f7a179 ;  context    0x26ac53f7a179 <FixedArray[5]>  (input #2)
    0x7fff5fbf4df0: [top + 8] <- 0x158efe782a91 ;  function    0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>  (input #0)
    -------------------------
    0x7fff5fbf4de8: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
  translating getter stub => height=0
    0x7fff5fbf4de0: [top + 32] <- 0x235ed184bed0 ;  caller's pc
    0x7fff5fbf4dd8: [top + 24] <- 0x7fff5fbf4e00 ;  caller's fp
    0x7fff5fbf4dd0: [top + 16] <- 0x0000001a ;  frame type (getter sentinel)
    0x7fff5fbf4dc8: [top + 8] <- 0x235ed16c7781 ;  code object
    0x7fff5fbf4dc0: [top + 0] <- 0x26ac53f7a179 ;  context
  translating frame get => node=3, height=8
    0x7fff5fbf4db8: [top + 40] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4db0: [top + 32] <- 0x235ed16c77f3 ;  caller's pc
    0x7fff5fbf4da8: [top + 24] <- 0x7fff5fbf4dd8 ;  caller's fp
    0x7fff5fbf4da0: [top + 16] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4d98: [top + 8] <- 0x153f567b18c9 ;  function    0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>  (input #0)
    -------------------------
    0x7fff5fbf4d90: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
[deoptimizing (eager): end 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)> @3 => node=3, pc=0x235ed184bf96, caller sp=0x7fff5fbf4e18, state=NO_REGISTERS, took 0.222 ms]
[deoptimizing (DEOPT eager): begin 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)> (opt #21) @3, FP to SP delta: 24, caller sp: 0x7fff5fbf4d80]
            ;;; deoptimize at -1_8429: wrong map
  reading input frame get => node=4, args=1, height=2; inputs:
      0: 0x153f567b18c9 ; [fp - 16] 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rax 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; [fp - 24] 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da02311 ; (literal 1) 0x34653da02311 <undefined>
  translating frame get => node=4, height=8
    0x7fff5fbf4d78: [top + 40] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4d70: [top + 32] <- 0x235ed184d3ca ;  caller's pc
    0x7fff5fbf4d68: [top + 24] <- 0x7fff5fbf4d98 ;  caller's fp
    0x7fff5fbf4d60: [top + 16] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4d58: [top + 8] <- 0x153f567b18c9 ;  function    0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>  (input #0)
    -------------------------
    0x7fff5fbf4d50: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
[deoptimizing (eager): end 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)> @3 => node=4, pc=0x235ed184bf96, caller sp=0x7fff5fbf4d80, state=NO_REGISTERS, took 0.073 ms]
[deoptimizing (DEOPT eager): begin 0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)> (opt #32) @3, FP to SP delta: 56, caller sp: 0x7fff5fbf4dc8]
            ;;; deoptimize at 0_8679: wrong map
  reading input frame set => node=16, args=2, height=2; inputs:
      0: 0x158efe782ad9 ; [fp - 16] 0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)>
      1: 0x38f392d96b81 ; rbx 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x1de96d915249 ; [fp + 16] 0x1de96d915249 <an Object with map 0x1c98d7e6d399>
      3: 0x26ac53f7a179 ; [fp - 24] 0x26ac53f7a179 <FixedArray[5]>
      4: 0x34653da04aa9 ; (literal 8) 0x34653da04aa9 <Odd Oddball: optimized_out>
  reading setter frame set; inputs:
      0: 0x153f567b1911 ; (literal 9) 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
      1: 0x38f392dd61c1 ; rcx 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x1de96d915249 ; [fp + 16] 0x1de96d915249 <an Object with map 0x1c98d7e6d399>
  reading input frame set => node=3, args=2, height=2; inputs:
      0: 0x153f567b1911 ; (literal 9) 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
      1: 0x38f392dd61c1 ; rcx 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x1de96d915249 ; [fp + 16] 0x1de96d915249 <an Object with map 0x1c98d7e6d399>
      3: 0x153f567d9761 ; (literal 10) 0x153f567d9761 <FixedArray[5]>
      4: 0x34653da02311 ; (literal 7) 0x34653da02311 <undefined>
  translating frame set => node=16, height=8
    0x7fff5fbf4dc0: [top + 48] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    0x7fff5fbf4db8: [top + 40] <- 0x1de96d915249 ;  0x1de96d915249 <an Object with map 0x1c98d7e6d399>  (input #2)
    -------------------------
    0x7fff5fbf4db0: [top + 32] <- 0x235ed1852c57 ;  caller's pc
    0x7fff5fbf4da8: [top + 24] <- 0x7fff5fbf4de8 ;  caller's fp
    0x7fff5fbf4da0: [top + 16] <- 0x26ac53f7a179 ;  context    0x26ac53f7a179 <FixedArray[5]>  (input #3)
    0x7fff5fbf4d98: [top + 8] <- 0x158efe782ad9 ;  function    0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)>  (input #0)
    -------------------------
    0x7fff5fbf4d90: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #4)
  translating setter stub => height=0
    0x7fff5fbf4d88: [top + 40] <- 0x235ed18500b3 ;  caller's pc
    0x7fff5fbf4d80: [top + 32] <- 0x7fff5fbf4da8 ;  caller's fp
    0x7fff5fbf4d78: [top + 24] <- 0x0000001a ;  frame type (setter sentinel)
    0x7fff5fbf4d70: [top + 16] <- 0x235ed16c7d41 ;  code object
    0x7fff5fbf4d68: [top + 8] <- 0x26ac53f7a179 ;  context
    0x7fff5fbf4d60: [top + 0] <- 0x1de96d915249 ;  0x1de96d915249 <an Object with map 0x1c98d7e6d399>  (input #2)
  translating frame set => node=3, height=8
    0x7fff5fbf4d58: [top + 48] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    0x7fff5fbf4d50: [top + 40] <- 0x1de96d915249 ;  0x1de96d915249 <an Object with map 0x1c98d7e6d399>  (input #2)
    -------------------------
    0x7fff5fbf4d48: [top + 32] <- 0x235ed16c7db4 ;  caller's pc
    0x7fff5fbf4d40: [top + 24] <- 0x7fff5fbf4d80 ;  caller's fp
    0x7fff5fbf4d38: [top + 16] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #3)
    0x7fff5fbf4d30: [top + 8] <- 0x153f567b1911 ;  function    0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>  (input #0)
    -------------------------
    0x7fff5fbf4d28: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #4)
[deoptimizing (eager): end 0x158efe782ad9 <JS Function set (SharedFunctionInfo 0x3e7fc7a46741)> @3 => node=3, pc=0x235ed1850176, caller sp=0x7fff5fbf4dc8, state=NO_REGISTERS, took 0.124 ms]
[deoptimizing (DEOPT eager): begin 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)> (opt #36) @17, FP to SP delta: 56, caller sp: 0x7fff5fbf4d20]
            ;;; deoptimize at -1_5597: wrong map
  reading input frame peek => node=87, args=1, height=5; inputs:
      0: 0x153f567e1f59 ; [fp - 16] 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>
      1: 0x38f392dd61c1 ; rax 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; [fp - 24] 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da04aa9 ; (literal 4) 0x34653da04aa9 <Odd Oddball: optimized_out>
      4: 0x34653da04aa9 ; (literal 4) 0x34653da04aa9 <Odd Oddball: optimized_out>
      5: 0x153f567e1f59 ; [fp - 32] 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>
      6: 0x1de96d913ee1 ; rbx 0x1de96d913ee1 <a VariableStackLayer with map 0x1c98d7e6ecb1>
  translating frame peek => node=87, height=32
    0x7fff5fbf4d18: [top + 64] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4d10: [top + 56] <- 0x235ed185021c ;  caller's pc
    0x7fff5fbf4d08: [top + 48] <- 0x7fff5fbf4d40 ;  caller's fp
    0x7fff5fbf4d00: [top + 40] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4cf8: [top + 32] <- 0x153f567e1f59 ;  function    0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>  (input #0)
    -------------------------
    0x7fff5fbf4cf0: [top + 24] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
    0x7fff5fbf4ce8: [top + 16] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #4)
    0x7fff5fbf4ce0: [top + 8] <- 0x153f567e1f59 ;  0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>  (input #5)
    0x7fff5fbf4cd8: [top + 0] <- 0x1de96d913ee1 ;  0x1de96d913ee1 <a VariableStackLayer with map 0x1c98d7e6ecb1>  (input #6)
[deoptimizing (eager): end 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)> @17 => node=87, pc=0x235ed18504b5, caller sp=0x7fff5fbf4d20, state=TOS_REGISTER, took 0.071 ms]
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:set) id{49,-1} start{8646} ---
(val) {
            if (!this.top.isRoot) {
                this.peek()[this.top.name] = val;
            }
            this.top.value = val;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{49,0} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
INLINE (peek) id{49,0} AS 0 AT <-1:8711>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{49,1} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{49,1} AS 1 AT <0:5576>
[deoptimizing (DEOPT eager): begin 0x158efe7e6eb9 <JS Function (SharedFunctionInfo 0x153f567937f9)> (opt #42) @5, FP to SP delta: 176, caller sp: 0x7fff5fbf4e00]
            ;;; deoptimize at -1_297: wrong map
  reading input frame  => node=4, args=3, height=1; inputs:
      0: 0x158efe7e6eb9 ; [fp - 16] 0x158efe7e6eb9 <JS Function (SharedFunctionInfo 0x153f567937f9)>
      1: 0x38f392d96b81 ; rax 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x31cbd921aa49 ; [fp + 24] 0x31cbd921aa49 <JS Function Uint8Array (SharedFunctionInfo 0x34653da14011)>
      3: 0x400000000 ; [fp + 16] 4
      4: 0x1de96d91bd79 ; rdx 0x1de96d91bd79 <FixedArray[5]>
  translating frame  => node=4, height=0
    0x7fff5fbf4df8: [top + 48] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    0x7fff5fbf4df0: [top + 40] <- 0x31cbd921aa49 ;  0x31cbd921aa49 <JS Function Uint8Array (SharedFunctionInfo 0x34653da14011)>  (input #2)
    0x7fff5fbf4de8: [top + 32] <- 0x400000000 ;  4  (input #3)
    -------------------------
    0x7fff5fbf4de0: [top + 24] <- 0x235ed184c4f1 ;  caller's pc
    0x7fff5fbf4dd8: [top + 16] <- 0x7fff5fbf4e20 ;  caller's fp
    0x7fff5fbf4dd0: [top + 8] <- 0x1de96d91bd79 ;  context    0x1de96d91bd79 <FixedArray[5]>  (input #4)
    0x7fff5fbf4dc8: [top + 0] <- 0x158efe7e6eb9 ;  function    0x158efe7e6eb9 <JS Function (SharedFunctionInfo 0x153f567937f9)>  (input #0)
    -------------------------
[deoptimizing (eager): end 0x158efe7e6eb9 <JS Function (SharedFunctionInfo 0x153f567937f9)> @5 => node=4, pc=0x235ed1854dab, caller sp=0x7fff5fbf4e00, state=NO_REGISTERS, took 0.086 ms]
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:buffer) id{50,-1} start{27862} ---
(name, length) {
            return this._pushJob({
                name: name,
                type: 'buffer',
                length: length
            });
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{50,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{50,0} AS 0 AT <-1:27903>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{50,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{50,1} AS 1 AT <0:22236>
[deoptimizing (DEOPT eager): begin 0x1de96d91c131 <JS Function (SharedFunctionInfo 0x26ac53f4d039)> (opt #43) @3, FP to SP delta: 48, caller sp: 0x7fff5fbf4e38]
            ;;; deoptimize at 1_8429: wrong map
  reading input frame  => node=26, args=1, height=2; inputs:
      0: 0x1de96d91c131 ; [fp - 16] 0x1de96d91c131 <JS Function (SharedFunctionInfo 0x26ac53f4d039)>
      1: 0x38f392d96b81 ; rax 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x1de96d91bd79 ; [fp - 24] 0x1de96d91bd79 <FixedArray[5]>
      3: 0x34653da02351 ; (literal 5) 0x34653da02351 <the hole>
  reading getter frame ; inputs:
      0: 0x158efe782a91 ; (literal 6) 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>
      1: 0x38f392d96b81 ; rax 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
  reading input frame get => node=16, args=1, height=2; inputs:
      0: 0x158efe782a91 ; (literal 6) 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>
      1: 0x38f392d96b81 ; rax 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x26ac53f7a179 ; (literal 7) 0x26ac53f7a179 <FixedArray[5]>
      3: 0x34653da04aa9 ; (literal 8) 0x34653da04aa9 <Odd Oddball: optimized_out>
  reading getter frame ; inputs:
      0: 0x153f567b18c9 ; (literal 9) 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rbx 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
  reading input frame get => node=3, args=1, height=2; inputs:
      0: 0x153f567b18c9 ; (literal 9) 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rbx 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; (literal 10) 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da02311 ; (literal 11) 0x34653da02311 <undefined>
  translating frame  => node=26, height=8
    0x7fff5fbf4e30: [top + 40] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4e28: [top + 32] <- 0x235ed184a05b ;  caller's pc
    0x7fff5fbf4e20: [top + 24] <- 0x7fff5fbf4e78 ;  caller's fp
    0x7fff5fbf4e18: [top + 16] <- 0x1de96d91bd79 ;  context    0x1de96d91bd79 <FixedArray[5]>  (input #2)
    0x7fff5fbf4e10: [top + 8] <- 0x1de96d91c131 ;  function    0x1de96d91c131 <JS Function (SharedFunctionInfo 0x26ac53f4d039)>  (input #0)
    -------------------------
    0x7fff5fbf4e08: [top + 0] <- 0x34653da02351 ;  0x34653da02351 <the hole>  (input #3)
  translating getter stub => height=0
    0x7fff5fbf4e00: [top + 32] <- 0x235ed18551b0 ;  caller's pc
    0x7fff5fbf4df8: [top + 24] <- 0x7fff5fbf4e20 ;  caller's fp
    0x7fff5fbf4df0: [top + 16] <- 0x0000001a ;  frame type (getter sentinel)
    0x7fff5fbf4de8: [top + 8] <- 0x235ed16c7781 ;  code object
    0x7fff5fbf4de0: [top + 0] <- 0x1de96d91bd79 ;  context
  translating frame get => node=16, height=8
    0x7fff5fbf4dd8: [top + 40] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4dd0: [top + 32] <- 0x235ed16c77f3 ;  caller's pc
    0x7fff5fbf4dc8: [top + 24] <- 0x7fff5fbf4df8 ;  caller's fp
    0x7fff5fbf4dc0: [top + 16] <- 0x26ac53f7a179 ;  context    0x26ac53f7a179 <FixedArray[5]>  (input #2)
    0x7fff5fbf4db8: [top + 8] <- 0x158efe782a91 ;  function    0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>  (input #0)
    -------------------------
    0x7fff5fbf4db0: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
  translating getter stub => height=0
    0x7fff5fbf4da8: [top + 32] <- 0x235ed184bed0 ;  caller's pc
    0x7fff5fbf4da0: [top + 24] <- 0x7fff5fbf4dc8 ;  caller's fp
    0x7fff5fbf4d98: [top + 16] <- 0x0000001a ;  frame type (getter sentinel)
    0x7fff5fbf4d90: [top + 8] <- 0x235ed16c7781 ;  code object
    0x7fff5fbf4d88: [top + 0] <- 0x26ac53f7a179 ;  context
  translating frame get => node=3, height=8
    0x7fff5fbf4d80: [top + 40] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4d78: [top + 32] <- 0x235ed16c77f3 ;  caller's pc
    0x7fff5fbf4d70: [top + 24] <- 0x7fff5fbf4da0 ;  caller's fp
    0x7fff5fbf4d68: [top + 16] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4d60: [top + 8] <- 0x153f567b18c9 ;  function    0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>  (input #0)
    -------------------------
    0x7fff5fbf4d58: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
[deoptimizing (eager): end 0x1de96d91c131 <JS Function (SharedFunctionInfo 0x26ac53f4d039)> @3 => node=3, pc=0x235ed184bf96, caller sp=0x7fff5fbf4e38, state=NO_REGISTERS, took 0.221 ms]
[marking dependent code 0x235ed187d081 (opt #43) for deoptimization, reason: field-owner]
[deoptimize marked code in all contexts]
[deoptimizer unlinked:  / 1de96d907c41]
[deoptimizer unlinked:  / 1de96d9042c1]
[deoptimizer unlinked:  / 177627a7ef41]
[deoptimizer unlinked:  / 177627a7bdc9]
[deoptimizer unlinked:  / 177627a78c51]
[deoptimizer unlinked:  / 177627a75ad9]
[deoptimizer unlinked:  / 177627a72961]
[deoptimizer unlinked:  / 177627a6f7e9]
[deoptimizer unlinked:  / 177627a6c671]
[deoptimizer unlinked:  / 177627a694f9]
[deoptimizer unlinked:  / 177627a66381]
[deoptimizer unlinked:  / 177627a63209]
[deoptimizer unlinked:  / 177627a60091]
[deoptimizer unlinked:  / 177627a5cc79]
[deoptimizer unlinked:  / 177627a597c9]
[deoptimizer unlinked:  / 177627a56651]
[deoptimizer unlinked:  / 177627a534d9]
[deoptimizer unlinked:  / 177627a50361]
[deoptimizer unlinked:  / 177627a4d1e9]
[deoptimizer unlinked:  / 177627a4a071]
[deoptimizer unlinked:  / 177627a46ef9]
[deoptimizer unlinked:  / 177627a43d81]
[deoptimizer unlinked:  / 177627a40c09]
[deoptimizer unlinked:  / 177627a3da91]
[deoptimizer unlinked:  / 177627a3a919]
[deoptimizer unlinked:  / 177627a377a1]
[deoptimizer unlinked:  / 177627a34629]
[deoptimizer unlinked:  / 177627a31179]
[deoptimizer unlinked:  / 177627a2e001]
[deoptimizer unlinked:  / 177627a2ae89]
[deoptimizer unlinked:  / 177627a27d11]
[deoptimizer unlinked:  / 177627a24b99]
[deoptimizer unlinked:  / 177627a21a21]
[deoptimizer unlinked:  / 177627a1e8a9]
[deoptimizer unlinked:  / 177627a1b731]
[deoptimizer unlinked:  / 177627a185b9]
[deoptimizer unlinked:  / 177627a15441]
[deoptimizer unlinked:  / 177627a122c9]
[deoptimizer unlinked:  / 177627a0f151]
[deoptimizer unlinked:  / 177627a0be71]
[deoptimizer unlinked:  / 177627a089c1]
[deoptimizer unlinked:  / 177627a05849]
[deoptimizer unlinked:  / 177627a026d1]
[deoptimizer unlinked:  / 3f880d27d351]
[deoptimizer unlinked:  / 3f880d27a1d9]
[deoptimizer unlinked:  / 3f880d277061]
[deoptimizer unlinked:  / 3f880d273ee9]
[deoptimizer unlinked:  / 3f880d270d71]
[deoptimizer unlinked:  / 3f880d26dbf9]
[deoptimizer unlinked:  / 3f880d26aa81]
[deoptimizer unlinked:  / 3f880d267909]
[deoptimizer unlinked:  / 3f880d264791]
[deoptimizer unlinked:  / 3f880d261619]
[deoptimizer unlinked:  / 3f880d25e169]
[deoptimizer unlinked:  / 3f880d25aff1]
[deoptimizer unlinked:  / 3f880d257e79]
[deoptimizer unlinked:  / 3f880d254c69]
[deoptimizer unlinked:  / 3f880d251671]
[deoptimizer unlinked:  / 3f880d24e499]
[deoptimizer unlinked:  / 3f880d24b2c1]
[deoptimizer unlinked:  / 3f880d2480e9]
[deoptimizer unlinked:  / 3f880d244f11]
[deoptimizer unlinked:  / 3f880d241d39]
[deoptimizer unlinked:  / 3f880d23eb61]
[deoptimizer unlinked:  / 3f880d23b989]
[deoptimizer unlinked:  / 3f880d2387b1]
[deoptimizer unlinked:  / 3f880d2352a1]
[deoptimizer unlinked:  / 3f880d2320c9]
[deoptimizer unlinked:  / 3f880d22eef1]
[deoptimizer unlinked:  / 3f880d22bd19]
[deoptimizer unlinked:  / 3f880d2288a1]
[deoptimizer unlinked:  / 3f880d2256c9]
[deoptimizer unlinked:  / 3f880d2224f1]
[deoptimizer unlinked:  / 3f880d21f319]
[deoptimizer unlinked:  / 3f880d21bc99]
[deoptimizing (DEOPT eager): begin 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)> (opt #49) @18, FP to SP delta: 64, caller sp: 0x7fff5fbf4d30]
            ;;; deoptimize at 0_5597: wrong map
  reading input frame set => node=63, args=2, height=3; inputs:
      0: 0x153f567b1911 ; [fp - 16] 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
      1: 0x38f392dd61c1 ; r8 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x1de96d919db9 ; [fp + 16] 0x1de96d919db9 <an Object with map 0x1c98d7e6f391>
      3: 0x153f567d9761 ; [fp - 24] 0x153f567d9761 <FixedArray[5]>
      4: 0x153f567b1911 ; [fp - 32] 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>
      5: 0x153f567e1f59 ; (literal 6) 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>
  reading input frame peek => node=87, args=1, height=5; inputs:
      0: 0x153f567e1f59 ; (literal 6) 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>
      1: 0x38f392dd61c1 ; r8 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; (literal 7) 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da04aa9 ; (literal 8) 0x34653da04aa9 <Odd Oddball: optimized_out>
      4: 0x34653da04aa9 ; (literal 8) 0x34653da04aa9 <Odd Oddball: optimized_out>
      5: 0x153f567e1f59 ; (literal 6) 0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>
      6: 0x1de96d90f699 ; rax 0x1de96d90f699 <a VariableStackLayer with deprecated map 0x1c98d7e4f991>
  translating frame set => node=63, height=16
    0x7fff5fbf4d28: [top + 56] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    0x7fff5fbf4d20: [top + 48] <- 0x1de96d919db9 ;  0x1de96d919db9 <an Object with map 0x1c98d7e6f391>  (input #2)
    -------------------------
    0x7fff5fbf4d18: [top + 40] <- 0x235ed1852d3a ;  caller's pc
    0x7fff5fbf4d10: [top + 32] <- 0x7fff5fbf4d50 ;  caller's fp
    0x7fff5fbf4d08: [top + 24] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #3)
    0x7fff5fbf4d00: [top + 16] <- 0x153f567b1911 ;  function    0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>  (input #0)
    -------------------------
    0x7fff5fbf4cf8: [top + 8] <- 0x153f567b1911 ;  0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)>  (input #4)
    0x7fff5fbf4cf0: [top + 0] <- 0x153f567e1f59 ;  0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>  (input #5)
  translating frame peek => node=87, height=32
    0x7fff5fbf4ce8: [top + 64] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4ce0: [top + 56] <- 0x235ed185021c ;  caller's pc
    0x7fff5fbf4cd8: [top + 48] <- 0x7fff5fbf4d10 ;  caller's fp
    0x7fff5fbf4cd0: [top + 40] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4cc8: [top + 32] <- 0x153f567e1f59 ;  function    0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>  (input #0)
    -------------------------
    0x7fff5fbf4cc0: [top + 24] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
    0x7fff5fbf4cb8: [top + 16] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #4)
    0x7fff5fbf4cb0: [top + 8] <- 0x153f567e1f59 ;  0x153f567e1f59 <JS Function peek (SharedFunctionInfo 0x3e7fc7a4be49)>  (input #5)
    0x7fff5fbf4ca8: [top + 0] <- 0x1de96d90f699 ;  0x1de96d90f699 <a VariableStackLayer with deprecated map 0x1c98d7e4f991>  (input #6)
[deoptimizing (eager): end 0x153f567b1911 <JS Function set (SharedFunctionInfo 0x3e7fc7a4c259)> @18 => node=87, pc=0x235ed18504b5, caller sp=0x7fff5fbf4d30, state=TOS_REGISTER, took 0.237 ms]
[deoptimizing (DEOPT eager): begin 0x1de96d912109 <JS Function (SharedFunctionInfo 0x26ac53f42689)> (opt #40) @3, FP to SP delta: 96, caller sp: 0x7fff5fbf4e38]
            ;;; deoptimize at 1_8429: wrong map
  reading input frame  => node=26, args=1, height=2; inputs:
      0: 0x1de96d912109 ; [fp - 16] 0x1de96d912109 <JS Function (SharedFunctionInfo 0x26ac53f42689)>
      1: 0x38f392d96b81 ; rdi 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x1de96d911ec9 ; [fp - 24] 0x1de96d911ec9 <FixedArray[6]>
      3: 0x34653da02311 ; (literal 15) 0x34653da02311 <undefined>
  reading getter frame ; inputs:
      0: 0x158efe782a91 ; (literal 16) 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>
      1: 0x38f392d96b81 ; rdi 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
  reading input frame get => node=16, args=1, height=2; inputs:
      0: 0x158efe782a91 ; (literal 16) 0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>
      1: 0x38f392d96b81 ; rdi 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x26ac53f7a179 ; (literal 17) 0x26ac53f7a179 <FixedArray[5]>
      3: 0x34653da04aa9 ; (literal 18) 0x34653da04aa9 <Odd Oddball: optimized_out>
  reading getter frame ; inputs:
      0: 0x153f567b18c9 ; (literal 19) 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rax 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
  reading input frame get => node=3, args=1, height=2; inputs:
      0: 0x153f567b18c9 ; (literal 19) 0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>
      1: 0x38f392dd61c1 ; rax 0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>
      2: 0x153f567d9761 ; (literal 20) 0x153f567d9761 <FixedArray[5]>
      3: 0x34653da02311 ; (literal 15) 0x34653da02311 <undefined>
  translating frame  => node=26, height=8
    0x7fff5fbf4e30: [top + 40] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4e28: [top + 32] <- 0x235ed184a05b ;  caller's pc
    0x7fff5fbf4e20: [top + 24] <- 0x7fff5fbf4e78 ;  caller's fp
    0x7fff5fbf4e18: [top + 16] <- 0x1de96d911ec9 ;  context    0x1de96d911ec9 <FixedArray[6]>  (input #2)
    0x7fff5fbf4e10: [top + 8] <- 0x1de96d912109 ;  function    0x1de96d912109 <JS Function (SharedFunctionInfo 0x26ac53f42689)>  (input #0)
    -------------------------
    0x7fff5fbf4e08: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
  translating getter stub => height=0
    0x7fff5fbf4e00: [top + 32] <- 0x235ed1857168 ;  caller's pc
    0x7fff5fbf4df8: [top + 24] <- 0x7fff5fbf4e20 ;  caller's fp
    0x7fff5fbf4df0: [top + 16] <- 0x0000001a ;  frame type (getter sentinel)
    0x7fff5fbf4de8: [top + 8] <- 0x235ed16c7781 ;  code object
    0x7fff5fbf4de0: [top + 0] <- 0x1de96d911ec9 ;  context
  translating frame get => node=16, height=8
    0x7fff5fbf4dd8: [top + 40] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4dd0: [top + 32] <- 0x235ed16c77f3 ;  caller's pc
    0x7fff5fbf4dc8: [top + 24] <- 0x7fff5fbf4df8 ;  caller's fp
    0x7fff5fbf4dc0: [top + 16] <- 0x26ac53f7a179 ;  context    0x26ac53f7a179 <FixedArray[5]>  (input #2)
    0x7fff5fbf4db8: [top + 8] <- 0x158efe782a91 ;  function    0x158efe782a91 <JS Function get (SharedFunctionInfo 0x3e7fc7a46671)>  (input #0)
    -------------------------
    0x7fff5fbf4db0: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
  translating getter stub => height=0
    0x7fff5fbf4da8: [top + 32] <- 0x235ed184bed0 ;  caller's pc
    0x7fff5fbf4da0: [top + 24] <- 0x7fff5fbf4dc8 ;  caller's fp
    0x7fff5fbf4d98: [top + 16] <- 0x0000001a ;  frame type (getter sentinel)
    0x7fff5fbf4d90: [top + 8] <- 0x235ed16c7781 ;  code object
    0x7fff5fbf4d88: [top + 0] <- 0x26ac53f7a179 ;  context
  translating frame get => node=3, height=8
    0x7fff5fbf4d80: [top + 40] <- 0x38f392dd61c1 ;  0x38f392dd61c1 <a VariableStack with map 0x1c98d7e4fa41>  (input #1)
    -------------------------
    0x7fff5fbf4d78: [top + 32] <- 0x235ed16c77f3 ;  caller's pc
    0x7fff5fbf4d70: [top + 24] <- 0x7fff5fbf4da0 ;  caller's fp
    0x7fff5fbf4d68: [top + 16] <- 0x153f567d9761 ;  context    0x153f567d9761 <FixedArray[5]>  (input #2)
    0x7fff5fbf4d60: [top + 8] <- 0x153f567b18c9 ;  function    0x153f567b18c9 <JS Function get (SharedFunctionInfo 0x3e7fc7a4c189)>  (input #0)
    -------------------------
    0x7fff5fbf4d58: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
[deoptimizing (eager): end 0x1de96d912109 <JS Function (SharedFunctionInfo 0x26ac53f42689)> @3 => node=3, pc=0x235ed184bf96, caller sp=0x7fff5fbf4e38, state=NO_REGISTERS, took 0.569 ms]
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isPlainObject) id{51,-1} start{388785} ---
(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isObjectLike) id{51,0} start{381249} ---
(value) {
      return value != null && typeof value == 'object';
    }
--- END ---
INLINE (isObjectLike) id{51,0} AS 0 AT <-1:388806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:baseGetTag) id{51,1} start{100051} ---
(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      value = Object(value);
      return (symToStringTag && symToStringTag in value)
        ? getRawTag(value)
        : objectToString(value);
    }
--- END ---
INLINE (baseGetTag) id{51,1} AS 1 AT <-1:388829>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:objectToString) id{51,2} start{216325} ---
(value) {
      return nativeObjectToString.call(value);
    }
--- END ---
INLINE (objectToString) id{51,2} AS 2 AT <1:100280>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:) id{51,3} start{40985} ---
(arg) {
      return func(transform(arg));
    }
--- END ---
INLINE () id{51,3} AS 3 AT <-1:388911>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{52,-1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_loop) id{53,-1} start{12297} ---
() {
                var job = _this2.jobs[0];
                var remainingBuffer = _this2.streamBuffer.length - _this2.chunkOffset;

                if (job.type === 'push') {
                    // in strictObjectMode the variable being pushed has to be a real object.
                    // this prevents accidentaly pushing numbers, strings, etc.
                    if (_this2.options.strictObjectMode && typeof _this2.vars[job.name] !== 'undefined' && !(0, _lodash.isPlainObject)(_this2.vars[job.name])) {
                        throw new TypeError('Can\x5c't push into a non-object value (' + job.name + ') in strictObjectMode');
                    }

                    _this2.jobs.shift();
                    _this2.varStack.push(job.name, job.value);
                    return 'continue';
                } else if (job.type === 'pop') {
                    _this2.jobs.shift();
                    _this2.varStack.pop();
                    return 'continue';
                } else if (job.type === 'tap') {
                    _this2.jobs.shift();

                    var unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        // if the tap has a name, push a new var-layer
                        _this2.push(job.name).tap(job.callback, job.args).pop();
                    } else {
                        // otherwise we continue working on the current layer
                        job.callback.apply(_this2, job.args);
                    }

                    unqueue();
                    return 'continue';
                } else if (job.type === 'loop') {
                    // wait for more data before executing a loop on an empty buffer.
                    // this way empty objects are not being added when the stream finishes
                    if (remainingBuffer === 0) {
                        return 'break';
                    }

                    if (job.finished) {
                        _this2.jobs.shift();
                        return 'continue';
                    }

                    var loopIdentifier = _this2.options.loopIdentifier;
                    var _unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        if (typeof _this2.vars[job.name] === 'undefined') {
                            _this2.vars[job.name] = [];
                        }

                        _this2.tap(loopIdentifier, job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        });
                    } else {
                        // make copy, in case the user discards the result
                        // {@link CorrodeBase#options.anonymousLoopDiscardDeep}
                        if (_this2.options.anonymousLoopDiscardDeep) {
                            job[loopIdentifier] = (0, _lodash.cloneDeep)(_this2.vars);
                        } else {
                            job[loopIdentifier] = _extends({}, _this2.vars);
                        }

                        _this2.tap(job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            if (job.discarded && typeof job[loopIdentifier] !== 'undefined') {
                                this.vars = job[loopIdentifier];
                            }
                            job.discarded = false;
                            delete job[loopIdentifier];
                        });
                    }

                    _unqueue();
                    return 'continue';
                }

                // determine length of next job
                var length = typeof job.length === 'string' ? _this2.vars[job.length] : job.length;

                // only valid numbers can be used as length
                if (typeof length !== 'number') {
                    throw new TypeError('Cannot find a valid length for job ' + job.name + ', dereferenced length is ' + JSON.stringify(length));
                }

                // break on unsufficient streamBuffer-length (wait if not unwinding yet)
                if (_this2.streamBuffer.length - _this2.chunkOffset < length) {
                    if (_this2.isUnwinding && _this2.jobs.length > 0) {
                        // unwind loop, by removing the loop job
                        _this2.removeReadJobs();
                        return 'continue';
                    }

                    return 'break';
                }

                if (job.type === 'buffer') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.slice(_this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'string') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.toString(job.encoding, _this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'skip') {
                    _this2.jobs.shift();
                    if (_this2.streamOffset + length < 0) {
                        throw new RangeError('cannot skip below 0');
                    }
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (typeof _this2.primitveMap[job.type] === 'function') {
                    _this2.vars[job.name] = _this2.primitveMap[job.type](job);
                    _this2.jobs.shift();
                    _this2._moveOffset(length);
                } else {
                    throw new Error('invalid job type \x5c'' + job.type + '\x5c'');
                }
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{53,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{53,0} AS 0 AT <-1:12721>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{53,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{53,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:push) id{53,2} start{6808} ---
(name) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (typeof this.value[name] === 'undefined') {
                // only push new value if there's no old one
                this.value[name] = value;
            } else {
                // otherwise re-push the current one
                value = this.value[name];
            }

            var index = this.stack.push(new VariableStackLayer(value, false, name));
            this.top = this.stack[index - 1];
        }
--- END ---
INLINE (push) id{53,2} AS 2 AT <-1:13033>
INLINE (get) id{53,1} AS 3 AT <2:6941>
INLINE (get) id{53,1} AS 4 AT <2:7054>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:VariableStackLayer) id{53,3} start{918} ---
() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, VariableStackLayer);

    this.isRoot = false;
    this.value = {};
    this.name = null;

    this.value = value;
    this.isRoot = isRoot;
    this.name = name;
}
--- END ---
INLINE (VariableStackLayer) id{53,3} AS 5 AT <2:7247>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:_classCallCheck) id{53,4} start{735} ---
(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
--- END ---
INLINE (_classCallCheck) id{53,4} AS 6 AT <5:1197>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:pop) id{53,5} start{7550} ---
() {
            var popLayer = this.top;
            if (popLayer.isRoot) {
                throw new ReferenceError('can\x5c't pop root layer');
            }

            this.stack.pop();

            this.top = this.stack[this.stack.length - 1];

            // reassure that the value in the layer above is right
            // (in case of non-object values)
            this.value[popLayer.name] = popLayer.value;
        }
--- END ---
INLINE (pop) id{53,5} AS 7 AT <-1:13225>
INLINE (get) id{53,1} AS 8 AT <7:7928>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:push) id{53,6} start{27041} ---
(name, value) {
            return this._pushJob({
                type: 'push',
                name: name,
                value: value
            });
        }
--- END ---
INLINE (push) id{53,6} AS 9 AT <-1:13578>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{53,7} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{53,7} AS 10 AT <9:27081>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{53,8} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{53,8} AS 11 AT <10:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{53,9} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{53,9} AS 12 AT <-1:13593>
INLINE (_pushJob) id{53,7} AS 13 AT <12:23325>
INLINE (_typeof) id{53,8} AS 14 AT <13:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/index.js:loopGuard) id{54,-1} start{5822} ---
(end, discard, i) {
                    fn.call(this, end, discard, i);

                    if (i >= length - 1) {
                        end();
                    }
                }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{55,-1} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{55,0} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{55,0} AS 0 AT <-1:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:jobLoop) id{56,-1} start{12222} ---
() {
            var _this2 = this;

            var _loop = function _loop() {
                var job = _this2.jobs[0];
                var remainingBuffer = _this2.streamBuffer.length - _this2.chunkOffset;

                if (job.type === 'push') {
                    // in strictObjectMode the variable being pushed has to be a real object.
                    // this prevents accidentaly pushing numbers, strings, etc.
                    if (_this2.options.strictObjectMode && typeof _this2.vars[job.name] !== 'undefined' && !(0, _lodash.isPlainObject)(_this2.vars[job.name])) {
                        throw new TypeError('Can\x5c't push into a non-object value (' + job.name + ') in strictObjectMode');
                    }

                    _this2.jobs.shift();
                    _this2.varStack.push(job.name, job.value);
                    return 'continue';
                } else if (job.type === 'pop') {
                    _this2.jobs.shift();
                    _this2.varStack.pop();
                    return 'continue';
                } else if (job.type === 'tap') {
                    _this2.jobs.shift();

                    var unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        // if the tap has a name, push a new var-layer
                        _this2.push(job.name).tap(job.callback, job.args).pop();
                    } else {
                        // otherwise we continue working on the current layer
                        job.callback.apply(_this2, job.args);
                    }

                    unqueue();
                    return 'continue';
                } else if (job.type === 'loop') {
                    // wait for more data before executing a loop on an empty buffer.
                    // this way empty objects are not being added when the stream finishes
                    if (remainingBuffer === 0) {
                        return 'break';
                    }

                    if (job.finished) {
                        _this2.jobs.shift();
                        return 'continue';
                    }

                    var loopIdentifier = _this2.options.loopIdentifier;
                    var _unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        if (typeof _this2.vars[job.name] === 'undefined') {
                            _this2.vars[job.name] = [];
                        }

                        _this2.tap(loopIdentifier, job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        });
                    } else {
                        // make copy, in case the user discards the result
                        // {@link CorrodeBase#options.anonymousLoopDiscardDeep}
                        if (_this2.options.anonymousLoopDiscardDeep) {
                            job[loopIdentifier] = (0, _lodash.cloneDeep)(_this2.vars);
                        } else {
                            job[loopIdentifier] = _extends({}, _this2.vars);
                        }

                        _this2.tap(job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            if (job.discarded && typeof job[loopIdentifier] !== 'undefined') {
                                this.vars = job[loopIdentifier];
                            }
                            job.discarded = false;
                            delete job[loopIdentifier];
                        });
                    }

                    _unqueue();
                    return 'continue';
                }

                // determine length of next job
                var length = typeof job.length === 'string' ? _this2.vars[job.length] : job.length;

                // only valid numbers can be used as length
                if (typeof length !== 'number') {
                    throw new TypeError('Cannot find a valid length for job ' + job.name + ', dereferenced length is ' + JSON.stringify(length));
                }

                // break on unsufficient streamBuffer-length (wait if not unwinding yet)
                if (_this2.streamBuffer.length - _this2.chunkOffset < length) {
                    if (_this2.isUnwinding && _this2.jobs.length > 0) {
                        // unwind loop, by removing the loop job
                        _this2.removeReadJobs();
                        return 'continue';
                    }

                    return 'break';
                }

                if (job.type === 'buffer') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.slice(_this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'string') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.toString(job.encoding, _this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'skip') {
                    _this2.jobs.shift();
                    if (_this2.streamOffset + length < 0) {
                        throw new RangeError('cannot skip below 0');
                    }
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (typeof _this2.primitveMap[job.type] === 'function') {
                    _this2.vars[job.name] = _this2.primitveMap[job.type](job);
                    _this2.jobs.shift();
                    _this2._moveOffset(length);
                } else {
                    throw new Error('invalid job type \x5c'' + job.type + '\x5c'');
                }
            };

            // {@link CorrodeBase#jobs} get's manipulated by {@link CorrodeBase#jobLoop}
            _loop2: while (this.jobs.length > 0) {
                var _ret = _loop();

                switch (_ret) {
                    case 'continue':
                        continue;

                    case 'break':
                        break _loop2;}
            }
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/map/index.js:push) id{57,-1} start{6800} ---
() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'values';

  this.vars = this.vars[name];
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{57,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{57,0} AS 0 AT <-1:6915>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{57,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{57,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:set) id{57,2} start{6093} ---
(val) {
            this.varStack.value = val;
        }
--- END ---
INLINE (set) id{57,2} AS 2 AT <-1:6909>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:set) id{57,3} start{8646} ---
(val) {
            if (!this.top.isRoot) {
                this.peek()[this.top.name] = val;
            }
            this.top.value = val;
        }
--- END ---
INLINE (set) id{57,3} AS 3 AT <2:6133>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{57,4} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
INLINE (peek) id{57,4} AS 4 AT <3:8711>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{57,5} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{57,5} AS 5 AT <4:5576>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:) id{58,-1} start{14848} ---
() {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{58,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{58,0} AS 0 AT <-1:14902>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{58,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{58,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isPlainObject) id{58,2} start{388785} ---
(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
      return typeof Ctor == 'function' && Ctor instanceof Ctor &&
        funcToString.call(Ctor) == objectCtorString;
    }
--- END ---
INLINE (isPlainObject) id{58,2} AS 2 AT <-1:15149>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:isObjectLike) id{58,3} start{381249} ---
(value) {
      return value != null && typeof value == 'object';
    }
--- END ---
INLINE (isObjectLike) id{58,3} AS 3 AT <2:388806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:baseGetTag) id{58,4} start{100051} ---
(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      value = Object(value);
      return (symToStringTag && symToStringTag in value)
        ? getRawTag(value)
        : objectToString(value);
    }
--- END ---
INLINE (baseGetTag) id{58,4} AS 4 AT <2:388829>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:objectToString) id{58,5} start{216325} ---
(value) {
      return nativeObjectToString.call(value);
    }
--- END ---
INLINE (objectToString) id{58,5} AS 5 AT <4:100280>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/lodash/lodash.js:) id{58,6} start{40985} ---
(arg) {
      return func(transform(arg));
    }
--- END ---
INLINE () id{58,6} AS 6 AT <2:388911>
INLINE (get) id{58,0} AS 7 AT <-1:15240>
INLINE (get) id{58,1} AS 8 AT <7:5032>
INLINE (get) id{58,0} AS 9 AT <-1:15394>
INLINE (get) id{58,1} AS 10 AT <9:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint16) id{59,-1} start{32927} ---
(name) {
            return this._pushJob(name, 'uint16', 2, this.options.endianness);
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{59,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{59,0} AS 0 AT <-1:32960>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{59,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{59,1} AS 1 AT <0:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint16) id{60,-1} start{8439} ---
(job) {
                return _this.streamBuffer['readUInt16' + job.endianness](_this.chunkOffset);
            }
--- END ---
--- FUNCTION SOURCE (buffer.js:Buffer.readUInt16LE) id{61,-1} start{29223} ---
(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert)
    checkOffset(offset, 2, this.length);
  return this[offset] | (this[offset + 1] << 8);
}
--- END ---
--- FUNCTION SOURCE (buffer.js:checkOffset) id{61,0} start{28196} ---
(offset, ext, length) {
  if (offset + ext > length)
    throw new RangeError('Index out of range');
}
--- END ---
INLINE (checkOffset) id{61,0} AS 0 AT <-1:29290>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{62,-1} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{62,0} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{62,0} AS 0 AT <-1:5576>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{63,-1} start{220} ---
(type, elementCount) {
    this
        .buffer('buffer', elementCount * type.BYTES_PER_ELEMENT)
        .tap(function () {
        const buffer = this.vars.buffer;
        this.vars.array = new type(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    })
        .map.push('array');
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:buffer) id{63,0} start{27862} ---
(name, length) {
            return this._pushJob({
                name: name,
                type: 'buffer',
                length: length
            });
        }
--- END ---
INLINE (buffer) id{63,0} AS 0 AT <-1:261>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{63,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{63,1} AS 1 AT <0:27903>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{63,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{63,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{63,3} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{63,3} AS 3 AT <-1:326>
INLINE (_pushJob) id{63,1} AS 4 AT <3:23325>
INLINE (_typeof) id{63,2} AS 5 AT <4:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{63,4} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{63,4} AS 6 AT <-1:520>
INLINE (tap) id{63,3} AS 7 AT <6:806>
INLINE (_pushJob) id{63,1} AS 8 AT <7:23325>
INLINE (_typeof) id{63,2} AS 9 AT <8:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{64,-1} start{339} ---
() {
        const buffer = this.vars.buffer;
        this.vars.array = new type(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{64,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{64,0} AS 0 AT <-1:371>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{64,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{64,1} AS 1 AT <0:5032>
INLINE (get) id{64,0} AS 2 AT <-1:397>
INLINE (get) id{64,1} AS 3 AT <2:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{65,-1} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{65,0} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{65,0} AS 0 AT <-1:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{65,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{65,1} AS 1 AT <0:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{65,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{65,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{66,-1} start{2252} ---
() {
                    this
                        .ext.tvector2('uv')
                        .map.push('uv');
                }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{66,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{66,0} AS 0 AT <-1:2355>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{66,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{66,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{66,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{66,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{66,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{66,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{67,-1} start{855} ---
() {
    this
        .ext.nativeArray('vec2', Float32Array, 2)
        .map.push('vec2');
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{67,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{67,0} AS 0 AT <-1:932>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{67,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{67,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{67,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{67,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{67,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{67,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{68,-1} start{2520} ---
() {
                this
                    .uint16('vertex2')
                    .uint16('vertex1')
                    .uint16('materialId')
                    .uint16('vertex3');
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint16) id{68,0} start{32927} ---
(name) {
            return this._pushJob(name, 'uint16', 2, this.options.endianness);
        }
--- END ---
INLINE (uint16) id{68,0} AS 0 AT <-1:2567>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{68,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{68,1} AS 1 AT <0:32960>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{68,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{68,2} AS 2 AT <1:22236>
INLINE (uint16) id{68,0} AS 3 AT <-1:2606>
INLINE (_pushJob) id{68,1} AS 4 AT <3:32960>
INLINE (_typeof) id{68,2} AS 5 AT <4:22236>
INLINE (uint16) id{68,0} AS 6 AT <-1:2645>
INLINE (_pushJob) id{68,1} AS 7 AT <6:32960>
INLINE (_typeof) id{68,2} AS 8 AT <7:22236>
INLINE (uint16) id{68,0} AS 9 AT <-1:2687>
INLINE (_pushJob) id{68,1} AS 10 AT <9:32960>
INLINE (_typeof) id{68,2} AS 11 AT <10:22236>
--- FUNCTION SOURCE (native arraybuffer.js:slice) id{69,-1} start{203} ---
(h,i){
if(!(%_ClassOf(this)==='ArrayBuffer')){
throw %make_type_error(46,
'ArrayBuffer.prototype.slice',this);
}
var j=(%_ToInteger(h));
if(!(i===(void 0))){
i=(%_ToInteger(i));
}
var k;
var l=%_ArrayBufferGetByteLength(this);
if(j<0){
k=d(l+j,0);
}else{
k=e(j,l);
}
var m=(i===(void 0))?l:i;
var n;
if(m<0){
n=d(l+m,0);
}else{
n=e(m,l);
}
if(n<k){
n=k;
}
var o=n-k;
var p=f(this,c,true);
var q=new p(o);
if(!(%_ClassOf(q)==='ArrayBuffer')){
throw %make_type_error(46,
'ArrayBuffer.prototype.slice',q);
}
if(q===this){
throw %make_type_error(11);
}
if(%_ArrayBufferGetByteLength(q)<o){
throw %make_type_error(10);
}
%ArrayBufferSliceImpl(this,q,k,o);
return q;
}
--- END ---
--- FUNCTION SOURCE (native runtime.js:MinSimple) id{69,0} start{426} ---
(k,l){
return k>l?l:k;
}
--- END ---
INLINE (MinSimple) id{69,0} AS 0 AT <-1:460>
INLINE (MinSimple) id{69,0} AS 1 AT <-1:533>
--- FUNCTION SOURCE (native typedarray.js:Float32ArrayConstructByArrayBuffer) id{70,-1} start{18634} ---
(Z,aa,ab,ac){
if(!(ab===(void 0))){
ab=C(ab,171);
}
if(!(ac===(void 0))){
ac=C(ac,171);
}
if(ac>%_MaxSmi()){
throw %make_range_error(171);
}
var ad=%_ArrayBufferGetByteLength(aa);
var ae;
if((ab===(void 0))){
ae=0;
}else{
ae=ab;
if(ae % 4!==0){
throw %make_range_error(169,
"start offset","Float32Array",4);
}
}
var af;
if((ac===(void 0))){
if(ad % 4!==0){
throw %make_range_error(169,
"byte length","Float32Array",4);
}
af=ad-ae;
if(af<0){
throw %make_range_error(162,ae);
}
}else{
af=ac*4;
if(ae+af>ad){
throw %make_range_error(171);
}
}
%_TypedArrayInitialize(Z,7,aa,ae,af,true);
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{71,-1} start{3251} ---
() {
                        this
                            .ext.tvector3('vector')
                            .map.push('vector');
                    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{71,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{71,0} AS 0 AT <-1:3370>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{71,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{71,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{71,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{71,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{71,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{71,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{72,-1} start{3560} ---
() {
                        this
                            .ext.tvector3('vector')
                            .map.push('vector');
                    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{72,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{72,0} AS 0 AT <-1:3679>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{72,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{72,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{72,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{72,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{72,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{72,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/bin-mesh-plg.js:) id{73,-1} start{1515} ---
() {
            this
                .uint32('index')
                .map.push('index');
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint32) id{73,0} start{35189} ---
(name) {
            return this._pushJob(name, 'uint32', 4, this.options.endianness);
        }
--- END ---
INLINE (uint32) id{73,0} AS 0 AT <-1:1554>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{73,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{73,1} AS 1 AT <0:35222>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{73,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{73,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{73,3} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{73,3} AS 3 AT <-1:1591>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{73,4} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{73,4} AS 4 AT <3:806>
INLINE (_pushJob) id{73,1} AS 5 AT <4:23325>
INLINE (_typeof) id{73,2} AS 6 AT <5:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:_offset) id{74,-1} start{856} ---
(offset) {
  var tot = 0, i = 0, _t
  for (; i < this._bufs.length; i++) {
    _t = tot + this._bufs[i].length
    if (offset < _t)
      return [ i, offset - tot ]
    tot = _t
  }
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/index.js:Corrode.EXTENSIONS.(anonymous function)) id{75,-1} start{13493} ---
() {
                for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    args[_key - 1] = arguments[_key];
                }

                var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'values';

                return this.tap(name, function () {
                    var value = fn.apply(this, args);

                    if (typeof value !== 'undefined') {
                        if (this.options.strictObjectMode && this.jobs.length > 0 && value !== this && !(0, _lodash.isPlainObject)(value)) {
                            throw new TypeError('Can\x5c't mix immediate returns with later reads on a non-object value (' + JSON.stringify(value) + ') in strictObjectMode');
                        }
                        /** @type {Object} vars {@link CorrodeBase#vars} */
                        this.vars = value;
                    }
                });
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{75,0} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{75,0} AS 0 AT <-1:13827>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{75,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{75,1} AS 1 AT <0:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{75,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{75,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (buffer.js:FastBuffer) id{76,-1} start{1596} ---
(arg1, arg2, arg3) {
    super(arg1, arg2, arg3);
  }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:copy) id{77,-1} start{2490} ---
(dst, dstStart, srcStart, srcEnd) {
  if (typeof srcStart != 'number' || srcStart < 0)
    srcStart = 0
  if (typeof srcEnd != 'number' || srcEnd > this.length)
    srcEnd = this.length
  if (srcStart >= this.length)
    return dst || new Buffer(0)
  if (srcEnd <= 0)
    return dst || new Buffer(0)

  var copy   = !!dst
    , off    = this._offset(srcStart)
    , len    = srcEnd - srcStart
    , bytes  = len
    , bufoff = (copy && dstStart) || 0
    , start  = off[1]
    , l
    , i

  // copy/slice everything
  if (srcStart === 0 && srcEnd == this.length) {
    if (!copy) // slice, just return a full concat
      return Buffer.concat(this._bufs)

    // copy, need to copy individual buffers
    for (i = 0; i < this._bufs.length; i++) {
      this._bufs[i].copy(dst, bufoff)
      bufoff += this._bufs[i].length
    }

    return dst
  }

  // easy, cheap case where it's a subset of one of the buffers
  if (bytes <= this._bufs[off[0]].length - start) {
    return copy
      ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes)
      : this._bufs[off[0]].slice(start, start + bytes)
  }

  if (!copy) // a slice, we need something to copy in to
    dst = new Buffer(len)

  for (i = off[0]; i < this._bufs.length; i++) {
    l = this._bufs[i].length - start

    if (bytes > l) {
      this._bufs[i].copy(dst, bufoff, start)
    } else {
      this._bufs[i].copy(dst, bufoff, start, start + bytes)
      break
    }

    bufoff += l
    bytes -= l

    if (start)
      start = 0
  }

  return dst
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:_offset) id{77,0} start{856} ---
(offset) {
  var tot = 0, i = 0, _t
  for (; i < this._bufs.length; i++) {
    _t = tot + this._bufs[i].length
    if (offset < _t)
      return [ i, offset - tot ]
    tot = _t
  }
}
--- END ---
INLINE (_offset) id{77,0} AS 0 AT <-1:2832>
--- FUNCTION SOURCE (buffer.js:slice) id{77,1} start{27886} ---
(start, end) {
  const srcLength = this.length;
  start = adjustOffset(start, srcLength);
  end = end !== undefined ? adjustOffset(end, srcLength) : srcLength;
  const newLength = end > start ? end - start : 0;
  return new FastBuffer(this.buffer, this.byteOffset + start, newLength);
}
--- END ---
INLINE (slice) id{77,1} AS 1 AT <-1:3568>
--- FUNCTION SOURCE (buffer.js:adjustOffset) id{77,2} start{27374} ---
(offset, length) {
  // Use Math.trunc() to convert offset to an integer value that can be larger
  // than an Int32. Hence, don't use offset | 0 or similar techniques.
  offset = Math.trunc(offset);
  // `x !== x`-style conditionals are a faster form of `isNaN(x)`
  if (offset === 0 || offset !== offset) {
    return 0;
  } else if (offset < 0) {
    offset += length;
    return offset > 0 ? offset : 0;
  } else {
    return offset < length ? offset : length;
  }
}
--- END ---
INLINE (adjustOffset) id{77,2} AS 2 AT <1:27944>
INLINE (adjustOffset) id{77,2} AS 3 AT <1:28004>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/section.js:) id{78,-1} start{205} ---
(expectedSectionType, dataCallback) {
    this.vars.__name__ = 'rwsSection';
    if (typeof expectedSectionType === 'function' && !dataCallback) {
        dataCallback = expectedSectionType;
        expectedSectionType = null;
    }
    this
        .ext.rwsHeader('header')
        .tap(function () {
        const { header } = this.vars;
        const { type } = header;
        const predictedEndOffset = this.streamOffset + header.size;
        if (expectedSectionType && type !== expectedSectionType) {
            console.log(this.varStack.stack);
            this.throw(new TypeError(`Expected RWS-Section of type ${expectedSectionType}, found ${type} instead. At position: ${this.streamOffset - 12}\x5cnHeader:\x5cn${JSON.stringify(header)}`));
        }
        if (type === sectionTypes.RW_DATA) {
            if (!dataCallback) {
                this.throw(new Error(`Encountered data section, while no callback was provided.\x5cnHeader:\x5cn${JSON.stringify(header)}`));
            }
            this.tap('data', () => dataCallback.call(this, header));
        }
        else if (type === sectionTypes.RW_CLUMP) {
            this.ext.rwsClump('data', header);
        }
        else if (type === sectionTypes.RW_FRAME_LIST) {
            this.ext.rwsFrameList('data', header);
        }
        else if (type === sectionTypes.RW_EXTENSION) {
            this.ext.rwsExtension('data', header);
        }
        else if (type === sectionTypes.RW_FRAME) {
            this.ext.rwsFrame('data', header);
        }
        else if (type === sectionTypes.RW_GEOMETRY_LIST) {
            this.ext.rwsGeometryList('data', header);
        }
        else if (type === sectionTypes.RW_GEOMETRY) {
            this.ext.rwsGeometry('data', header);
        }
        else if (type === sectionTypes.RW_MATERIAL_LIST) {
            this.ext.rwsMaterialList('data', header);
        }
        else if (type === sectionTypes.RW_MATERIAL) {
            this.ext.rwsMaterial('data', header);
        }
        else if (type === sectionTypes.RW_TEXTURE) {
            this.ext.rwsTexture('data', header);
        }
        else if (type === sectionTypes.RW_ATOMIC) {
            this.ext.rwsAtomic('data', header);
        }
        else if (type === sectionTypes.RW_TEXTURE_DICTIONARY) {
            this.ext.rwsTextureDictionary('data', header);
        }
        else if (type === sectionTypes.RW_TEXTURE_NATIVE) {
            this.ext.rwsTextureNative('data', header);
            // PLUGINS
        }
        else if (type === sectionTypes.RW_H_ANIM_PLG) {
            this.ext.rwsHAnimPlg('data', header);
        }
        else if (type === sectionTypes.RW_BIN_MESH_PLG) {
            this.ext.rwsBinMeshPlg('data', header);
        }
        else if (type === sectionTypes.RW_MORPH_PLG) {
            this.ext.rwsMorphPlg('data', header);
        }
        else if (type === sectionTypes.RW_MATERIAL_EFFECTS_PLG) {
            this.ext.rwsMaterialEffectsPlg('data', header);
            // PRIMITIVES
        }
        else if (type === sectionTypes.RW_STRING) {
            this
                .string('data', header.size)
                .map.trimNull('data');
            // SKIP
        }
        else if (type === sectionTypes.RW_SKY_MIPMAP) {
            // TODO: ignore?
            this.skip(header.size);
            this.vars.data = {
                __name__: 'rwsIgnored',
                type: sectionTypes.getNameByType(header.type)
            };
        }
        else {
            console.warn('encountered unknown section-type.', sectionTypes.getNameByType(header.type), header, ' using buffer');
            this.buffer('data', header.size);
            //throw new Error(`No Section handler for type ${type}.\x5cnHeader:\x5cn${JSON.stringify(header)}`);
        }
        this.map.push('data');
    });
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{78,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{78,0} AS 0 AT <-1:251>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{78,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{78,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{78,2} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{78,2} AS 2 AT <-1:489>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{78,3} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{78,3} AS 3 AT <2:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{78,4} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{78,4} AS 4 AT <3:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/header.js:) id{79,-1} start{155} ---
() {
    this
        .uint32('type')
        .uint32('size')
        .ext.rwsVersion('version');
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint32) id{79,0} start{35189} ---
(name) {
            return this._pushJob(name, 'uint32', 4, this.options.endianness);
        }
--- END ---
INLINE (uint32) id{79,0} AS 0 AT <-1:178>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{79,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{79,1} AS 1 AT <0:35222>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{79,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{79,2} AS 2 AT <1:22236>
INLINE (uint32) id{79,0} AS 3 AT <-1:202>
INLINE (_pushJob) id{79,1} AS 4 AT <3:35222>
INLINE (_typeof) id{79,2} AS 5 AT <4:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/version.js:) id{80,-1} start{156} ---
() {
    this
        .uint32('packed')
        .tap(function () {
        const { packed } = this.vars;
        const unpacked = {};
        if (packed & 0xFFFF0000) {
            unpacked.version = (packed >> 14 & 0x3FF00) + 0x30000 | (packed >> 16 & 0x3F);
            unpacked.build = packed & 0xFFFF;
        }
        else {
            unpacked.version = packed << 8;
            unpacked.build = 0;
        }
        this.vars = unpacked;
    });
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint32) id{80,0} start{35189} ---
(name) {
            return this._pushJob(name, 'uint32', 4, this.options.endianness);
        }
--- END ---
INLINE (uint32) id{80,0} AS 0 AT <-1:179>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{80,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{80,1} AS 1 AT <0:35222>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{80,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{80,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{80,3} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{80,3} AS 3 AT <-1:205>
INLINE (_pushJob) id{80,1} AS 4 AT <3:23325>
INLINE (_typeof) id{80,2} AS 5 AT <4:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/version.js:) id{81,-1} start{218} ---
() {
        const { packed } = this.vars;
        const unpacked = {};
        if (packed & 0xFFFF0000) {
            unpacked.version = (packed >> 14 & 0x3FF00) + 0x30000 | (packed >> 16 & 0x3F);
            unpacked.build = packed & 0xFFFF;
        }
        else {
            unpacked.version = packed << 8;
            unpacked.build = 0;
        }
        this.vars = unpacked;
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{81,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{81,0} AS 0 AT <-1:254>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{81,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{81,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:set) id{81,2} start{6093} ---
(val) {
            this.varStack.value = val;
        }
--- END ---
INLINE (set) id{81,2} AS 2 AT <-1:591>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:set) id{81,3} start{8646} ---
(val) {
            if (!this.top.isRoot) {
                this.peek()[this.top.name] = val;
            }
            this.top.value = val;
        }
--- END ---
INLINE (set) id{81,3} AS 3 AT <2:6133>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{81,4} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
INLINE (peek) id{81,4} AS 4 AT <3:8711>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{81,5} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{81,5} AS 5 AT <4:5576>
[deoptimizing (DEOPT soft): begin 0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)> (opt #53) @100, FP to SP delta: 288, caller sp: 0x7fff5fbf4e70]
            ;;; deoptimize at -1_17096: Insufficient type feedback for generic named access
  reading input frame _loop => node=1189, args=1, height=6; inputs:
      0: 0x38f392d96be9 ; [fp - 16] 0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>
      1: 0x34653da02311 ; [fp + 16] 0x34653da02311 <undefined>
      2: 0x2c0c3f1d46d1 ; [fp - 24] 0x2c0c3f1d46d1 <FixedArray[6]>
      3: 0x34653da04aa9 ; (literal 22) 0x34653da04aa9 <Odd Oddball: optimized_out>
      4: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      5: 0x34653da02311 ; (literal 21) 0x34653da02311 <undefined>
      6: 0x34653da04aa9 ; (literal 22) 0x34653da04aa9 <Odd Oddball: optimized_out>
      7: 0x34653da04aa9 ; (literal 22) 0x34653da04aa9 <Odd Oddball: optimized_out>
  translating frame _loop => node=1189, height=40
    0x7fff5fbf4e68: [top + 72] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #1)
    -------------------------
    0x7fff5fbf4e60: [top + 64] <- 0x235ed188ee07 ;  caller's pc
    0x7fff5fbf4e58: [top + 56] <- 0x7fff5fbf4ec8 ;  caller's fp
    0x7fff5fbf4e50: [top + 48] <- 0x2c0c3f1d46d1 ;  context    0x2c0c3f1d46d1 <FixedArray[6]>  (input #2)
    0x7fff5fbf4e48: [top + 40] <- 0x38f392d96be9 ;  function    0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>  (input #0)
    -------------------------
    0x7fff5fbf4e40: [top + 32] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #3)
    0x7fff5fbf4e38: [top + 24] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #4)
    0x7fff5fbf4e30: [top + 16] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #5)
    0x7fff5fbf4e28: [top + 8] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #6)
    0x7fff5fbf4e20: [top + 0] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #7)
[deoptimizing (soft): end 0x38f392d96be9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)> @100 => node=1189, pc=0x235ed184acd5, caller sp=0x7fff5fbf4e70, state=NO_REGISTERS, took 0.375 ms]
[deoptimizing (DEOPT eager): begin 0x31cbd926b919 <JS Function slice (SharedFunctionInfo 0x31cbd9253001)> (opt #30) @2, FP to SP delta: 80, caller sp: 0x7fff5fbf5400]
            ;;; deoptimize at -1_27925: wrong map
  reading input frame slice => node=4, args=3, height=4; inputs:
      0: 0x31cbd926b919 ; [fp - 16] 0x31cbd926b919 <JS Function slice (SharedFunctionInfo 0x31cbd9253001)>
      1: 0x2c0c3f1d4ee9 ; rax 0x2c0c3f1d4ee9 <an Uint8Array with map 0x1c98d7e6b661>
      2: 0x00000000 ; [fp + 24] 0
      3: 0xc80000000000 ; [fp + 16] 51200
      4: 0x1f9d304a8459 ; [fp - 24] 0x1f9d304a8459 <FixedArray[44]>
      5: 0x34653da02351 ; (literal 3) 0x34653da02351 <the hole>
      6: 0x34653da02351 ; (literal 3) 0x34653da02351 <the hole>
      7: 0x34653da02311 ; (literal 4) 0x34653da02311 <undefined>
  translating frame slice => node=4, height=24
    0x7fff5fbf53f8: [top + 72] <- 0x2c0c3f1d4ee9 ;  0x2c0c3f1d4ee9 <an Uint8Array with map 0x1c98d7e6b661>  (input #1)
    0x7fff5fbf53f0: [top + 64] <- 0x00000000 ;  0  (input #2)
    0x7fff5fbf53e8: [top + 56] <- 0xc80000000000 ;  51200  (input #3)
    -------------------------
    0x7fff5fbf53e0: [top + 48] <- 0x235ed1845b34 ;  caller's pc
    0x7fff5fbf53d8: [top + 40] <- 0x7fff5fbf5420 ;  caller's fp
    0x7fff5fbf53d0: [top + 32] <- 0x1f9d304a8459 ;  context    0x1f9d304a8459 <FixedArray[44]>  (input #4)
    0x7fff5fbf53c8: [top + 24] <- 0x31cbd926b919 ;  function    0x31cbd926b919 <JS Function slice (SharedFunctionInfo 0x31cbd9253001)>  (input #0)
    -------------------------
    0x7fff5fbf53c0: [top + 16] <- 0x34653da02351 ;  0x34653da02351 <the hole>  (input #5)
    0x7fff5fbf53b8: [top + 8] <- 0x34653da02351 ;  0x34653da02351 <the hole>  (input #6)
    0x7fff5fbf53b0: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #7)
[deoptimizing (eager): end 0x31cbd926b919 <JS Function slice (SharedFunctionInfo 0x31cbd9253001)> @2 => node=4, pc=0x235ed1845c69, caller sp=0x7fff5fbf5400, state=NO_REGISTERS, took 0.109 ms]
--- FUNCTION SOURCE (buffer.js:adjustOffset) id{82,-1} start{27374} ---
(offset, length) {
  // Use Math.trunc() to convert offset to an integer value that can be larger
  // than an Int32. Hence, don't use offset | 0 or similar techniques.
  offset = Math.trunc(offset);
  // `x !== x`-style conditionals are a faster form of `isNaN(x)`
  if (offset === 0 || offset !== offset) {
    return 0;
  } else if (offset < 0) {
    offset += length;
    return offset > 0 ? offset : 0;
  } else {
    return offset < length ? offset : length;
  }
}
--- END ---
[deoptimizing (DEOPT eager): begin 0x26ac53f7a0e9 <JS Function jobLoop (SharedFunctionInfo 0x3e7fc7a47239)> (opt #56) @5, FP to SP delta: 88, caller sp: 0x7fff5fbf4ee0]
            ;;; deoptimize at -1_18865: value mismatch
  reading input frame jobLoop => node=48, args=1, height=5; inputs:
      0: 0x26ac53f7a0e9 ; [fp - 16] 0x26ac53f7a0e9 <JS Function jobLoop (SharedFunctionInfo 0x3e7fc7a47239)>
      1: 0x38f392d96b81 ; rdx 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x2c0c3f1d59b1 ; rbx 0x2c0c3f1d59b1 <FixedArray[5]>
      3: 0x2c0c3f1d59e9 ; rax 0x2c0c3f1d59e9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>
      4: 0x34653da02311 ; (literal 1) 0x34653da02311 <undefined>
      5: 0x34653da02311 ; (literal 1) 0x34653da02311 <undefined>
      6: 0x34653da02311 ; (literal 1) 0x34653da02311 <undefined>
  translating frame jobLoop => node=48, height=32
    0x7fff5fbf4ed8: [top + 64] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4ed0: [top + 56] <- 0x235ed18491b6 ;  caller's pc
    0x7fff5fbf4ec8: [top + 48] <- 0x7fff5fbf4f00 ;  caller's fp
    0x7fff5fbf4ec0: [top + 40] <- 0x2c0c3f1d59b1 ;  context    0x2c0c3f1d59b1 <FixedArray[5]>  (input #2)
    0x7fff5fbf4eb8: [top + 32] <- 0x26ac53f7a0e9 ;  function    0x26ac53f7a0e9 <JS Function jobLoop (SharedFunctionInfo 0x3e7fc7a47239)>  (input #0)
    -------------------------
    0x7fff5fbf4eb0: [top + 24] <- 0x2c0c3f1d59e9 ;  0x2c0c3f1d59e9 <JS Function _loop (SharedFunctionInfo 0x26ac53f42389)>  (input #3)
    0x7fff5fbf4ea8: [top + 16] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #4)
    0x7fff5fbf4ea0: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #5)
    0x7fff5fbf4e98: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #6)
[deoptimizing (eager): end 0x26ac53f7a0e9 <JS Function jobLoop (SharedFunctionInfo 0x3e7fc7a47239)> @5 => node=48, pc=0x235ed18495ce, caller sp=0x7fff5fbf4ee0, state=NO_REGISTERS, took 0.064 ms]
[deoptimizing (DEOPT soft): begin 0x3e7fc7a631b1 <JS Function copy (SharedFunctionInfo 0x3e7fc7a523c9)> (opt #77) @26, FP to SP delta: 152, caller sp: 0x7fff5fbf4d70]
            ;;; deoptimize at -1_3699: Insufficient type feedback for generic keyed access
  reading input frame copy => node=651, args=5, height=9; inputs:
      0: 0x3e7fc7a631b1 ; [fp - 16] 0x3e7fc7a631b1 <JS Function copy (SharedFunctionInfo 0x3e7fc7a523c9)>
      1: 0x38f392dcbb79 ; [fp + 48] 0x38f392dcbb79 <a BufferList with map 0x1c98d7e511a1>
      2: 0x2c0c3f1d5b41 ; rax 0x2c0c3f1d5b41 <an Uint8Array with map 0x1c98d7e31bc1>
      3: 0x00000000 ; [fp + 32] 0
      4: 0 ; (int) [fp - 48] 
      5: 4 ; (int) [fp - 56] 
      6: 0x153f567c3799 ; [fp - 24] 0x153f567c3799 <FixedArray[6]>
      7: 0x34653da02421 ; [fp - 64] 0x34653da02421 <false>
      8: 0x2c0c3f1d5a99 ; [fp - 72] 0x2c0c3f1d5a99 <JS Array[2]>
      9: 0x34653da04aa9 ; (literal 11) 0x34653da04aa9 <Odd Oddball: optimized_out>
     10: 4 ; (int) [fp - 80] 
     11: 0x00000000 ; [fp - 32] 0
     12: 0 ; (int) [fp - 40] 
     13: 0x34653da02311 ; (literal 7) 0x34653da02311 <undefined>
     14: 0x34653da02311 ; (literal 7) 0x34653da02311 <undefined>
  translating frame copy => node=651, height=64
    0x7fff5fbf4d68: [top + 128] <- 0x38f392dcbb79 ;  0x38f392dcbb79 <a BufferList with map 0x1c98d7e511a1>  (input #1)
    0x7fff5fbf4d60: [top + 120] <- 0x2c0c3f1d5b41 ;  0x2c0c3f1d5b41 <an Uint8Array with map 0x1c98d7e31bc1>  (input #2)
    0x7fff5fbf4d58: [top + 112] <- 0x00000000 ;  0  (input #3)
    0x7fff5fbf4d50: [top + 104] <- 0x00000000 ;  0  (input #4)
    0x7fff5fbf4d48: [top + 96] <- 0x400000000 ;  4  (input #5)
    -------------------------
    0x7fff5fbf4d40: [top + 88] <- 0x235ed186ffba ;  caller's pc
    0x7fff5fbf4d38: [top + 80] <- 0x7fff5fbf4d88 ;  caller's fp
    0x7fff5fbf4d30: [top + 72] <- 0x153f567c3799 ;  context    0x153f567c3799 <FixedArray[6]>  (input #6)
    0x7fff5fbf4d28: [top + 64] <- 0x3e7fc7a631b1 ;  function    0x3e7fc7a631b1 <JS Function copy (SharedFunctionInfo 0x3e7fc7a523c9)>  (input #0)
    -------------------------
    0x7fff5fbf4d20: [top + 56] <- 0x34653da02421 ;  0x34653da02421 <false>  (input #7)
    0x7fff5fbf4d18: [top + 48] <- 0x2c0c3f1d5a99 ;  0x2c0c3f1d5a99 <JS Array[2]>  (input #8)
    0x7fff5fbf4d10: [top + 40] <- 0x34653da04aa9 ;  0x34653da04aa9 <Odd Oddball: optimized_out>  (input #9)
    0x7fff5fbf4d08: [top + 32] <- 0x400000000 ;  4  (input #10)
    0x7fff5fbf4d00: [top + 24] <- 0x00000000 ;  0  (input #11)
    0x7fff5fbf4cf8: [top + 16] <- 0x00000000 ;  0  (input #12)
    0x7fff5fbf4cf0: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #13)
    0x7fff5fbf4ce8: [top + 0] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #14)
[deoptimizing (soft): end 0x3e7fc7a631b1 <JS Function copy (SharedFunctionInfo 0x3e7fc7a523c9)> @26 => node=651, pc=0x235ed184ecd8, caller sp=0x7fff5fbf4d70, state=NO_REGISTERS, took 0.156 ms]
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_loop) id{83,-1} start{12297} ---
() {
                var job = _this2.jobs[0];
                var remainingBuffer = _this2.streamBuffer.length - _this2.chunkOffset;

                if (job.type === 'push') {
                    // in strictObjectMode the variable being pushed has to be a real object.
                    // this prevents accidentaly pushing numbers, strings, etc.
                    if (_this2.options.strictObjectMode && typeof _this2.vars[job.name] !== 'undefined' && !(0, _lodash.isPlainObject)(_this2.vars[job.name])) {
                        throw new TypeError('Can\x5c't push into a non-object value (' + job.name + ') in strictObjectMode');
                    }

                    _this2.jobs.shift();
                    _this2.varStack.push(job.name, job.value);
                    return 'continue';
                } else if (job.type === 'pop') {
                    _this2.jobs.shift();
                    _this2.varStack.pop();
                    return 'continue';
                } else if (job.type === 'tap') {
                    _this2.jobs.shift();

                    var unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        // if the tap has a name, push a new var-layer
                        _this2.push(job.name).tap(job.callback, job.args).pop();
                    } else {
                        // otherwise we continue working on the current layer
                        job.callback.apply(_this2, job.args);
                    }

                    unqueue();
                    return 'continue';
                } else if (job.type === 'loop') {
                    // wait for more data before executing a loop on an empty buffer.
                    // this way empty objects are not being added when the stream finishes
                    if (remainingBuffer === 0) {
                        return 'break';
                    }

                    if (job.finished) {
                        _this2.jobs.shift();
                        return 'continue';
                    }

                    var loopIdentifier = _this2.options.loopIdentifier;
                    var _unqueue = _this2.queueJobs();

                    if (typeof job.name !== 'undefined') {
                        if (typeof _this2.vars[job.name] === 'undefined') {
                            _this2.vars[job.name] = [];
                        }

                        _this2.tap(loopIdentifier, job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            var loopResult = this.vars[loopIdentifier];

                            // push vars only if job isn't discarded and yielded vars
                            // (no empty objects this way)
                            if (!job.discarded && (!(0, _lodash.isPlainObject)(loopResult) || Object.keys(loopResult).length > 0)) {
                                this.vars[job.name].push(loopResult);
                            }
                            job.discarded = false;
                            delete this.vars[loopIdentifier];
                        });
                    } else {
                        // make copy, in case the user discards the result
                        // {@link CorrodeBase#options.anonymousLoopDiscardDeep}
                        if (_this2.options.anonymousLoopDiscardDeep) {
                            job[loopIdentifier] = (0, _lodash.cloneDeep)(_this2.vars);
                        } else {
                            job[loopIdentifier] = _extends({}, _this2.vars);
                        }

                        _this2.tap(job.callback, [job.finish, job.discard, job.iteration++]).tap(function () {
                            if (job.discarded && typeof job[loopIdentifier] !== 'undefined') {
                                this.vars = job[loopIdentifier];
                            }
                            job.discarded = false;
                            delete job[loopIdentifier];
                        });
                    }

                    _unqueue();
                    return 'continue';
                }

                // determine length of next job
                var length = typeof job.length === 'string' ? _this2.vars[job.length] : job.length;

                // only valid numbers can be used as length
                if (typeof length !== 'number') {
                    throw new TypeError('Cannot find a valid length for job ' + job.name + ', dereferenced length is ' + JSON.stringify(length));
                }

                // break on unsufficient streamBuffer-length (wait if not unwinding yet)
                if (_this2.streamBuffer.length - _this2.chunkOffset < length) {
                    if (_this2.isUnwinding && _this2.jobs.length > 0) {
                        // unwind loop, by removing the loop job
                        _this2.removeReadJobs();
                        return 'continue';
                    }

                    return 'break';
                }

                if (job.type === 'buffer') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.slice(_this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'string') {
                    _this2.jobs.shift();
                    _this2.vars[job.name] = _this2.streamBuffer.toString(job.encoding, _this2.chunkOffset, _this2.chunkOffset + length);
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (job.type === 'skip') {
                    _this2.jobs.shift();
                    if (_this2.streamOffset + length < 0) {
                        throw new RangeError('cannot skip below 0');
                    }
                    _this2._moveOffset(length);
                    return 'continue';
                } else if (typeof _this2.primitveMap[job.type] === 'function') {
                    _this2.vars[job.name] = _this2.primitveMap[job.type](job);
                    _this2.jobs.shift();
                    _this2._moveOffset(length);
                } else {
                    throw new Error('invalid job type \x5c'' + job.type + '\x5c'');
                }
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{83,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{83,0} AS 0 AT <-1:12721>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{83,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{83,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:push) id{83,2} start{6808} ---
(name) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (typeof this.value[name] === 'undefined') {
                // only push new value if there's no old one
                this.value[name] = value;
            } else {
                // otherwise re-push the current one
                value = this.value[name];
            }

            var index = this.stack.push(new VariableStackLayer(value, false, name));
            this.top = this.stack[index - 1];
        }
--- END ---
INLINE (push) id{83,2} AS 2 AT <-1:13033>
INLINE (get) id{83,1} AS 3 AT <2:6941>
INLINE (get) id{83,1} AS 4 AT <2:7054>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:VariableStackLayer) id{83,3} start{918} ---
() {
    var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var isRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, VariableStackLayer);

    this.isRoot = false;
    this.value = {};
    this.name = null;

    this.value = value;
    this.isRoot = isRoot;
    this.name = name;
}
--- END ---
INLINE (VariableStackLayer) id{83,3} AS 5 AT <2:7247>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:_classCallCheck) id{83,4} start{735} ---
(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
--- END ---
INLINE (_classCallCheck) id{83,4} AS 6 AT <5:1197>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:pop) id{83,5} start{7550} ---
() {
            var popLayer = this.top;
            if (popLayer.isRoot) {
                throw new ReferenceError('can\x5c't pop root layer');
            }

            this.stack.pop();

            this.top = this.stack[this.stack.length - 1];

            // reassure that the value in the layer above is right
            // (in case of non-object values)
            this.value[popLayer.name] = popLayer.value;
        }
--- END ---
INLINE (pop) id{83,5} AS 7 AT <-1:13225>
INLINE (get) id{83,1} AS 8 AT <7:7928>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:push) id{83,6} start{27041} ---
(name, value) {
            return this._pushJob({
                type: 'push',
                name: name,
                value: value
            });
        }
--- END ---
INLINE (push) id{83,6} AS 9 AT <-1:13578>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{83,7} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{83,7} AS 10 AT <9:27081>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{83,8} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{83,8} AS 11 AT <10:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{83,9} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{83,9} AS 12 AT <-1:13593>
INLINE (_pushJob) id{83,7} AS 13 AT <12:23325>
INLINE (_typeof) id{83,8} AS 14 AT <13:22236>
--- FUNCTION SOURCE (buffer.js:slice) id{84,-1} start{27886} ---
(start, end) {
  const srcLength = this.length;
  start = adjustOffset(start, srcLength);
  end = end !== undefined ? adjustOffset(end, srcLength) : srcLength;
  const newLength = end > start ? end - start : 0;
  return new FastBuffer(this.buffer, this.byteOffset + start, newLength);
}
--- END ---
--- FUNCTION SOURCE (buffer.js:adjustOffset) id{84,0} start{27374} ---
(offset, length) {
  // Use Math.trunc() to convert offset to an integer value that can be larger
  // than an Int32. Hence, don't use offset | 0 or similar techniques.
  offset = Math.trunc(offset);
  // `x !== x`-style conditionals are a faster form of `isNaN(x)`
  if (offset === 0 || offset !== offset) {
    return 0;
  } else if (offset < 0) {
    offset += length;
    return offset > 0 ? offset : 0;
  } else {
    return offset < length ? offset : length;
  }
}
--- END ---
INLINE (adjustOffset) id{84,0} AS 0 AT <-1:27944>
INLINE (adjustOffset) id{84,0} AS 1 AT <-1:28004>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{85,-1} start{2252} ---
() {
                    this
                        .ext.tvector2('uv')
                        .map.push('uv');
                }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{85,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{85,0} AS 0 AT <-1:2355>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{85,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{85,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{85,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{85,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{85,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{85,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/tvector/index.js:) id{86,-1} start{339} ---
() {
        const buffer = this.vars.buffer;
        this.vars.array = new type(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{86,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{86,0} AS 0 AT <-1:371>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{86,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{86,1} AS 1 AT <0:5032>
INLINE (get) id{86,0} AS 2 AT <-1:397>
INLINE (get) id{86,1} AS 3 AT <2:5032>
--- FUNCTION SOURCE (native v8natives.js:Object) id{87,-1} start{783} ---
(n){
if(d!=new.target&&!(new.target===(void 0))){
return this;
}
if((n===null)||(n===(void 0)))return{};
return(%_ToObject(n));
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{88,-1} start{2520} ---
() {
                this
                    .uint16('vertex2')
                    .uint16('vertex1')
                    .uint16('materialId')
                    .uint16('vertex3');
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:uint16) id{88,0} start{32927} ---
(name) {
            return this._pushJob(name, 'uint16', 2, this.options.endianness);
        }
--- END ---
INLINE (uint16) id{88,0} AS 0 AT <-1:2567>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{88,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{88,1} AS 1 AT <0:32960>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{88,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{88,2} AS 2 AT <1:22236>
INLINE (uint16) id{88,0} AS 3 AT <-1:2606>
INLINE (_pushJob) id{88,1} AS 4 AT <3:32960>
INLINE (_typeof) id{88,2} AS 5 AT <4:22236>
INLINE (uint16) id{88,0} AS 6 AT <-1:2645>
INLINE (_pushJob) id{88,1} AS 7 AT <6:32960>
INLINE (_typeof) id{88,2} AS 8 AT <7:22236>
INLINE (uint16) id{88,0} AS 9 AT <-1:2687>
INLINE (_pushJob) id{88,1} AS 10 AT <9:32960>
INLINE (_typeof) id{88,2} AS 11 AT <10:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{89,-1} start{3251} ---
() {
                        this
                            .ext.tvector3('vector')
                            .map.push('vector');
                    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{89,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{89,0} AS 0 AT <-1:3370>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{89,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{89,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{89,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{89,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{89,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{89,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/openrwjs/dist/rwslib/parsers/rws/geometry.js:) id{90,-1} start{3560} ---
() {
                        this
                            .ext.tvector3('vector')
                            .map.push('vector');
                    }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/utils/index.js:) id{90,0} start{618} ---
() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return ctx.tap(fn.bind.apply(fn, [ctx].concat(args)));
        }
--- END ---
INLINE () id{90,0} AS 0 AT <-1:3679>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{90,1} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{90,1} AS 1 AT <0:806>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{90,2} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{90,2} AS 2 AT <1:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{90,3} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{90,3} AS 3 AT <2:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:BufferList.(anonymous function)) id{91,-1} start{5285} ---
(offset) {
        return this.slice(offset, offset + methods[m])[m](0)
      }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:slice) id{91,0} start{2389} ---
(start, end) {
  return this.copy(null, 0, start, end)
}
--- END ---
INLINE (slice) id{91,0} AS 0 AT <-1:5316>
--- FUNCTION SOURCE (native typedarray.js:Uint8Array) id{92,-1} start{3757} ---
(T,U,au){
if(!(new.target===(void 0))){
if((%_ClassOf(T)==='ArrayBuffer')||(%_ClassOf(T)==='SharedArrayBuffer')){
Uint8ArrayConstructByArrayBuffer(this,T,U,au);
}else if((%_IsTypedArray(T))){
Uint8ArrayConstructByTypedArray(this,T);
}else if((%_IsJSReceiver(T))){
var am=T[D];
if((am===(void 0))){
Uint8ArrayConstructByArrayLike(this,T,T.length);
}else{
Uint8ArrayConstructByIterable(this,T,am);
}
}else{
Uint8ArrayConstructByLength(this,T);
}
}else{
throw %make_type_error(27,"Uint8Array")
}
}
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:loop) id{93,-1} start{24337} ---
(name, callback) {
            if (typeof name === 'function') {
                callback = name;
                name = undefined;
            }

            var loopJob = {
                name: name,
                type: 'loop',
                callback: callback,
                finished: false,
                discarded: false,
                iteration: 0
            };

            loopJob.finish = function (discard) {
                loopJob.finished = true;
                loopJob.discarded = Boolean(discard);
            };

            loopJob.discard = function () {
                loopJob.discarded = true;
            };

            return this._pushJob(loopJob);
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{93,0} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{93,0} AS 0 AT <-1:25005>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{93,1} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{93,1} AS 1 AT <0:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:set) id{94,-1} start{6093} ---
(val) {
            this.varStack.value = val;
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:set) id{94,0} start{8646} ---
(val) {
            if (!this.top.isRoot) {
                this.peek()[this.top.name] = val;
            }
            this.top.value = val;
        }
--- END ---
INLINE (set) id{94,0} AS 0 AT <-1:6133>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peek) id{94,1} start{5446} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            return this.peekLayer(layerCount).value;
        }
--- END ---
INLINE (peek) id{94,1} AS 1 AT <0:8711>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:peekLayer) id{94,2} start{4795} ---
() {
            var layerCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            if (layerCount > this.stack.length - 1) {
                throw new ReferenceError('can\x5c't retrieve layer ' + layerCount + ', stack is ' + (this.stack.length - 1) + ' layers');
            }
            return this.stack[this.stack.length - 1 - layerCount];
        }
--- END ---
INLINE (peekLayer) id{94,2} AS 2 AT <1:5576>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/index.js:repeat) id{95,-1} start{5219} ---
(name, length, fn) {
            if (typeof name === 'number' || typeof length === 'function') {
                fn = length;
                length = name;
                name = undefined;
            }

            return this.tap(function () {
                if (typeof length === 'string') {
                    length = this.vars[length];
                }

                if (length === 0) {
                    if (name) {
                        this.vars[name] = [];
                    }
                    return this;
                }

                var loopGuard = function loopGuard(end, discard, i) {
                    fn.call(this, end, discard, i);

                    if (i >= length - 1) {
                        end();
                    }
                };

                if (!name) {
                    return this.loop(loopGuard);
                }

                return this.loop(name, loopGuard);
            });
        }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:tap) id{95,0} start{23115} ---
(name, callback, args) {
            if (typeof name === 'function') {
                args = callback;
                callback = name;
                name = undefined;
            }

            return this._pushJob({
                name: name,
                type: 'tap',
                args: args,
                callback: callback
            });
        }
--- END ---
INLINE (tap) id{95,0} AS 0 AT <-1:5449>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_pushJob) id{95,1} start{22129} ---
(name, type, length, endianness) {
            this.jobs.push((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object' ? name : {
                name: name,
                type: type,
                length: length,
                endianness: endianness
            });
            return this;
        }
--- END ---
INLINE (_pushJob) id{95,1} AS 1 AT <0:23325>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:_typeof) id{95,2} start{238} ---
(obj) { return typeof obj; }
--- END ---
INLINE (_typeof) id{95,2} AS 2 AT <1:22236>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/index.js:) id{96,-1} start{5462} ---
() {
                if (typeof length === 'string') {
                    length = this.vars[length];
                }

                if (length === 0) {
                    if (name) {
                        this.vars[name] = [];
                    }
                    return this;
                }

                var loopGuard = function loopGuard(end, discard, i) {
                    fn.call(this, end, discard, i);

                    if (i >= length - 1) {
                        end();
                    }
                };

                if (!name) {
                    return this.loop(loopGuard);
                }

                return this.loop(name, loopGuard);
            }
--- END ---
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:get) id{96,0} start{4995} ---
() {
            return this.varStack.value;
        }
--- END ---
INLINE (get) id{96,0} AS 0 AT <-1:5550>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/variable-stack.js:get) id{96,1} start{8397} ---
() {
            return this.top.value;
        }
--- END ---
INLINE (get) id{96,1} AS 1 AT <0:5032>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:copy) id{97,-1} start{2490} ---
(dst, dstStart, srcStart, srcEnd) {
  if (typeof srcStart != 'number' || srcStart < 0)
    srcStart = 0
  if (typeof srcEnd != 'number' || srcEnd > this.length)
    srcEnd = this.length
  if (srcStart >= this.length)
    return dst || new Buffer(0)
  if (srcEnd <= 0)
    return dst || new Buffer(0)

  var copy   = !!dst
    , off    = this._offset(srcStart)
    , len    = srcEnd - srcStart
    , bytes  = len
    , bufoff = (copy && dstStart) || 0
    , start  = off[1]
    , l
    , i

  // copy/slice everything
  if (srcStart === 0 && srcEnd == this.length) {
    if (!copy) // slice, just return a full concat
      return Buffer.concat(this._bufs)

    // copy, need to copy individual buffers
    for (i = 0; i < this._bufs.length; i++) {
      this._bufs[i].copy(dst, bufoff)
      bufoff += this._bufs[i].length
    }

    return dst
  }

  // easy, cheap case where it's a subset of one of the buffers
  if (bytes <= this._bufs[off[0]].length - start) {
    return copy
      ? this._bufs[off[0]].copy(dst, dstStart, start, start + bytes)
      : this._bufs[off[0]].slice(start, start + bytes)
  }

  if (!copy) // a slice, we need something to copy in to
    dst = new Buffer(len)

  for (i = off[0]; i < this._bufs.length; i++) {
    l = this._bufs[i].length - start

    if (bytes > l) {
      this._bufs[i].copy(dst, bufoff, start)
    } else {
      this._bufs[i].copy(dst, bufoff, start, start + bytes)
      break
    }

    bufoff += l
    bytes -= l

    if (start)
      start = 0
  }

  return dst
}
--- END ---
--- FUNCTION SOURCE (buffer.js:Buffer) id{97,0} start{4254} ---
(arg, encodingOrOffset, length) {
  doFlaggedDeprecation();
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      );
    }
    return Buffer.alloc(arg);
  }
  return Buffer.from(arg, encodingOrOffset, length);
}
--- END ---
INLINE (Buffer) id{97,0} AS 0 AT <-1:2725>
--- FUNCTION SOURCE (buffer.js:doFlaggedDeprecation) id{97,1} start{3657} ---
() {}
--- END ---
INLINE (doFlaggedDeprecation) id{97,1} AS 1 AT <0:4290>
INLINE (Buffer) id{97,0} AS 2 AT <-1:2776>
INLINE (doFlaggedDeprecation) id{97,1} AS 3 AT <2:4290>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/node_modules/bl/bl.js:_offset) id{97,2} start{856} ---
(offset) {
  var tot = 0, i = 0, _t
  for (; i < this._bufs.length; i++) {
    _t = tot + this._bufs[i].length
    if (offset < _t)
      return [ i, offset - tot ]
    tot = _t
  }
}
--- END ---
INLINE (_offset) id{97,2} AS 4 AT <-1:2832>
--- FUNCTION SOURCE (buffer.js:slice) id{97,3} start{27886} ---
(start, end) {
  const srcLength = this.length;
  start = adjustOffset(start, srcLength);
  end = end !== undefined ? adjustOffset(end, srcLength) : srcLength;
  const newLength = end > start ? end - start : 0;
  return new FastBuffer(this.buffer, this.byteOffset + start, newLength);
}
--- END ---
INLINE (slice) id{97,3} AS 5 AT <-1:3568>
--- FUNCTION SOURCE (buffer.js:adjustOffset) id{97,4} start{27374} ---
(offset, length) {
  // Use Math.trunc() to convert offset to an integer value that can be larger
  // than an Int32. Hence, don't use offset | 0 or similar techniques.
  offset = Math.trunc(offset);
  // `x !== x`-style conditionals are a faster form of `isNaN(x)`
  if (offset === 0 || offset !== offset) {
    return 0;
  } else if (offset < 0) {
    offset += length;
    return offset > 0 ? offset : 0;
  } else {
    return offset < length ? offset : length;
  }
}
--- END ---
INLINE (adjustOffset) id{97,4} AS 6 AT <5:27944>
INLINE (adjustOffset) id{97,4} AS 7 AT <5:28004>
INLINE (Buffer) id{97,0} AS 8 AT <-1:3668>
INLINE (doFlaggedDeprecation) id{97,1} AS 9 AT <8:4290>
--- FUNCTION SOURCE (/Users/screeny/src/corrode/dist/base.js:int32) id{98,-1} start{8589} ---
(job) {
                return _this.streamBuffer['readInt32' + job.endianness](_this.chunkOffset);
            }
--- END ---
--- FUNCTION SOURCE (buffer.js:Buffer.readInt32LE) id{99,-1} start{31757} ---
(offset, noAssert) {
  offset = offset >>> 0;
  if (!noAssert)
    checkOffset(offset, 4, this.length);

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24);
}
--- END ---
--- FUNCTION SOURCE (buffer.js:checkOffset) id{99,0} start{28196} ---
(offset, ext, length) {
  if (offset + ext > length)
    throw new RangeError('Index out of range');
}
--- END ---
INLINE (checkOffset) id{99,0} AS 0 AT <-1:31824>
[deoptimizing (DEOPT eager): begin 0x38f392dd5e81 <JS Function (SharedFunctionInfo 0x26ac53f42689)> (opt #58) @5, FP to SP delta: 96, caller sp: 0x7fff5fbf4d58]
            ;;; deoptimize at -1_15107: wrong map
  reading input frame  => node=18, args=1, height=3; inputs:
      0: 0x38f392dd5e81 ; [fp - 16] 0x38f392dd5e81 <JS Function (SharedFunctionInfo 0x26ac53f42689)>
      1: 0x38f392d96b81 ; [fp + 16] 0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>
      2: 0x38f392dd9429 ; rbx 0x38f392dd9429 <FixedArray[6]>
      3: 0x34653da02311 ; (literal 15) 0x34653da02311 <undefined>
      4: 0x38f392de0561 ; rax 0x38f392de0561 <an Object with map 0x1c98d7e6dd91>
  translating frame  => node=18, height=16
    0x7fff5fbf4d50: [top + 48] <- 0x38f392d96b81 ;  0x38f392d96b81 <a Corrode with map 0x1c98d7e606b9>  (input #1)
    -------------------------
    0x7fff5fbf4d48: [top + 40] <- 0x235ed18a3c26 ;  caller's pc
    0x7fff5fbf4d40: [top + 32] <- 0x7fff5fbf4e78 ;  caller's fp
    0x7fff5fbf4d38: [top + 24] <- 0x38f392dd9429 ;  context    0x38f392dd9429 <FixedArray[6]>  (input #2)
    0x7fff5fbf4d30: [top + 16] <- 0x38f392dd5e81 ;  function    0x38f392dd5e81 <JS Function (SharedFunctionInfo 0x26ac53f42689)>  (input #0)
    -------------------------
    0x7fff5fbf4d28: [top + 8] <- 0x34653da02311 ;  0x34653da02311 <undefined>  (input #3)
    0x7fff5fbf4d20: [top + 0] <- 0x38f392de0561 ;  0x38f392de0561 <an Object with map 0x1c98d7e6dd91>  (input #4)
[deoptimizing (eager): end 0x38f392dd5e81 <JS Function (SharedFunctionInfo 0x26ac53f42689)> @5 => node=18, pc=0x235ed1857187, caller sp=0x7fff5fbf4d58, state=TOS_REGISTER, took 0.072 ms]
