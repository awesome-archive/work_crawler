﻿/**
 * 載入批量下載線上作品（小說、漫畫）的主要功能。 Download novels / comics.
 */

'use strict';

// ----------------------------------------------------------------------------

// npm: 若有 CeJS module 則用之。
global.use_cejs_mudule = true;

// default directory to place comic images and novels. 指定下載的檔案要放置的標的目錄。
// '': the same as the .js running
global.data_directory = '';

// ------------------------------------
// configuration for arrangement/*.js

// default directory to place completed files
// 將會被指定為第一個存在的目錄。
global.completed_directory = [ '', '' ];

// 檔案分類完後要放置的標的目錄。
global.catalog_directory = '';

// ------------------------------------

try {
	// Load configuration.
	require('./work_crawler_loder.configuration.js');
} catch (e) {
}

if (data_directory
// && !CeL.directory_exists(data_directory)
) {
	try {
		// 若是目標目錄無法存取，那就放在當前目錄下。
		require('fs').accessSync(data_directory);
	} catch (e) {
		console.warn('Warning: Can not access [' + data_directory
				+ ']!\n下載的檔案將放在工具檔所在的目錄下。');
		data_directory = '';
	}
}

// ----------------------------------------------------------------------------
// Load CeJS library.

try {
	require('./_CeL.loader.nodejs.js');
} catch (e) {
}

// @see _CeL.loader.nodejs.js

if (typeof CeL !== 'function' && use_cejs_mudule) {
	try {
		require('cejs');
	} catch (e) {
	}
}

if (typeof CeL !== 'function') {
	console.error('Failed to load CeJS library!\n');
	console.info('請先安裝 CeJS library:\nnpm install cejs\n\n'
	//
	+ 'Or you may trying the latest version:\n'
	//
	+ 'See https://github.com/kanasimi/CeJS');
	throw 'No CeJS library';
}

// ----------------------------------------------------------------------------
// Load module.

// CeL.set_debug(6);

CeL.run([
// Add color to console messages. 添加主控端報告的顏色。
'interact.console',
// 載入批量下載小說、漫畫的主要功能。
'application.net.work_crawler' ]);

// ----------------------------------------------------------------------------

// console.log(process.argv);

global.work_id = CeL.env.arg_hash
		&& (CeL.env.arg_hash.title || CeL.env.arg_hash.id) || process.argv[2]
		|| global.work_id;

if (!work_id && process.mainModule
		&& (typeof need_work_id === 'undefined' || need_work_id)) {
	var main_script = process.mainModule.filename.match(/[^\\\/]+$/)[0];
	CeL.log('Usage:\n	node ' + main_script
			+ ' "work title / work id" [option=true]\n	node ' + main_script
			+ ' "l=work list file" [option=true]');
	CeL.log('options:'
	//
	+ Object.keys(CeL.work_crawler.prototype.import_arg_hash)
	//
	.map(function(key) {
		return '\n	' + key;
	}).join(''));
	process.exit();
}

// main_directory 必須以 path separator 作結。
CeL.work_crawler.prototype.main_directory = data_directory
		+ CeL.work_crawler.prototype.main_directory;

// CeL.set_debug(3);
