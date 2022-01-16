"use strict";

import * as vscode from "vscode";

const DEBUG_TYPE = "msbuild";

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.debug.registerDebugConfigurationProvider(
			DEBUG_TYPE,
			new MSBuildConfigurationProvider()
		)
	);

	context.subscriptions.push(
		vscode.debug.registerDebugAdapterDescriptorFactory(
			DEBUG_TYPE,
			new MSBuildDebugAdapterFactory()
		)
	);
}

export function deactivate() {
	// nothing to do
}

class MSBuildConfigurationProvider implements vscode.DebugConfigurationProvider {
	resolveDebugConfiguration(folder: vscode.WorkspaceFolder | undefined, config: vscode.DebugConfiguration, token?: vscode.CancellationToken): vscode.ProviderResult<vscode.DebugConfiguration> {

		if (!config.type && !config.request && !config.name) {
			const editor = vscode.window.activeTextEditor;
			if (editor && editor.document.languageId === "markdown") {
				config.type = DEBUG_TYPE;
				config.name = "Launch";
				config.request = "launch";
				config.program = "${file}";
			}
		}

		return config;
	}
}

class MSBuildDebugAdapterFactory implements vscode.DebugAdapterDescriptorFactory {

	createDebugAdapterDescriptor(_session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		// TODO: 手元のパスをべた書きするのをやめる
		const command = "D:\\workspace\\msbuild-debug-adapter\\artifacts\\bin\\DebugAdapter\\Debug\\net6.0\\DebugAdapter.exe";
		const args = [];
		return new vscode.DebugAdapterExecutable(command, args);
	}
}
