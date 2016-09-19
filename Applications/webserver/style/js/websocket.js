// websocket

var ws = {
	init: function() {
		ws.gateway = new WebSocket('ws://0.0.0.0:4355');
		console.log('ws init');
		ws.gateway.onmessage = function(event) {
			if (event.data == "") {
				return ;
			}
			var data = eval('(' + event.data + ')');
			console.log(data);
			var hashHost ;
			for (var host in data) {
				hashHost = hash(host);
				if (host == 'http://iyov.io:8080' || host == '0.0.0.0:4355') {
					continue;
				}
				if (!tree.exists(hashHost)) {
					tree.createNode('root', hashHost, host, false);
				}
				for (var url in data[host]) {
					if (data[host][url].hasOwnProperty('Path') && path(data[host][url]['Path'])) {
						parseUrl(host, data[host][url]);
						continue;
					}
					var id = hash(url + '_t_' +data[host][url]['StartTime']);
					if (!tree.exists(id)) {
						tree.createNode(hashHost, id, url, true);
					}

					cache.set(id, (url == 'default' ? host : host+'/'+url), data[host][url]);

					if ($("#iyov-content").children().length == 0) {
						tree.showData(id);
					}
				}
			}
		}
	}
};

/**
 * Md5,过滤特殊符号
 */
function hash(id) {
	return $.md5(id);
}

/**
 * 检查url的路径深度
 */
function path(path) {
	if (path.split('/').length <= 2) {
		return false;
	}

	return true
}

/**
 * 添加路径
 */
function parseUrl(parent, data) {
	var path = data['Path'];
	var starttime = data['StartTime'];
	var spices = path.split('/');
	var leaf = true;
	for (var index in spices) {
		if (spices[index] == '') {
			// 过滤首个空字符串
			continue;
		}
		var url = parent + '/' + spices[index];
		var id = (spices.length == parseInt(index) + 1) ? url + starttime : url;
		var hashId = hash(id);
		var hashParentId = hash(parent);
		if (tree.exists(hashId)) {
			parent = id;
			continue;
		}

		leaf = (index < spices.length - 1) ? false : true;
		if (!leaf) {
			tree.insertBefore(hashParentId, hashId, spices[index], leaf);
		} else {
			tree.createNode(hashParentId, hashId, spices[index], leaf);
			cache.set(hashId, url, data);
		}
		parent = id;
	}
}