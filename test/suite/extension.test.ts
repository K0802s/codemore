/**
 * Extension Test Suite
 * Tests for extension activation and basic functionality
 */

import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Starting CodeMore tests.');

    test('Extension should be present', () => {
        const extension = vscode.extensions.getExtension('codemore.codemore');
        assert.ok(extension, 'Extension should be present');
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('codemore.codemore');
        if (extension) {
            await extension.activate();
            assert.ok(extension.isActive, 'Extension should be active');
        }
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands();

        const expectedCommands = [
            'codemore.openDashboard',
            'codemore.analyzeWorkspace',
            'codemore.analyzeCurrentFile',
            'codemore.restartDaemon',
            'codemore.showLogs',
        ];

        for (const cmd of expectedCommands) {
            assert.ok(
                commands.includes(cmd),
                `Command ${cmd} should be registered`
            );
        }
    });
});
