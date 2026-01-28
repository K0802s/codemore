/**
 * Daemon Communication Tests
 * Tests for JSON-RPC communication with the daemon
 */

import * as assert from 'assert';
import {
    createRequest,
    createResponse,
    createErrorResponse,
    createNotification,
    isJsonRpcRequest,
    isJsonRpcResponse,
    isJsonRpcNotification,
} from '../../shared/protocol';

suite('Protocol Test Suite', () => {
    test('createRequest should create valid JSON-RPC request', () => {
        const request = createRequest('test-1', 'initialize', { workspacePath: '/test' });

        assert.strictEqual(request.jsonrpc, '2.0');
        assert.strictEqual(request.id, 'test-1');
        assert.strictEqual(request.method, 'initialize');
        assert.deepStrictEqual(request.params, { workspacePath: '/test' });
    });

    test('createResponse should create valid JSON-RPC response', () => {
        const response = createResponse('test-1', { success: true });

        assert.strictEqual(response.jsonrpc, '2.0');
        assert.strictEqual(response.id, 'test-1');
        assert.deepStrictEqual(response.result, { success: true });
        assert.strictEqual(response.error, undefined);
    });

    test('createErrorResponse should create valid JSON-RPC error response', () => {
        const response = createErrorResponse('test-1', {
            code: -32600,
            message: 'Invalid Request',
        });

        assert.strictEqual(response.jsonrpc, '2.0');
        assert.strictEqual(response.id, 'test-1');
        assert.strictEqual(response.result, undefined);
        assert.strictEqual(response.error?.code, -32600);
        assert.strictEqual(response.error?.message, 'Invalid Request');
    });

    test('createNotification should create valid JSON-RPC notification', () => {
        const notification = createNotification('daemon/ready', { version: '1.0.0' });

        assert.strictEqual(notification.jsonrpc, '2.0');
        assert.strictEqual(notification.method, 'daemon/ready');
        assert.deepStrictEqual(notification.params, { version: '1.0.0' });
        assert.strictEqual((notification as any).id, undefined);
    });

    test('isJsonRpcRequest should correctly identify requests', () => {
        const request = createRequest('1', 'test', {});
        const response = createResponse('1', {});
        const notification = createNotification('test', {});

        assert.ok(isJsonRpcRequest(request));
        assert.ok(!isJsonRpcRequest(response));
        assert.ok(!isJsonRpcRequest(notification));
        assert.ok(!isJsonRpcRequest(null));
        assert.ok(!isJsonRpcRequest({}));
    });

    test('isJsonRpcResponse should correctly identify responses', () => {
        const request = createRequest('1', 'test', {});
        const response = createResponse('1', {});
        const errorResponse = createErrorResponse('1', { code: -1, message: 'error' });

        assert.ok(!isJsonRpcResponse(request));
        assert.ok(isJsonRpcResponse(response));
        assert.ok(isJsonRpcResponse(errorResponse));
    });

    test('isJsonRpcNotification should correctly identify notifications', () => {
        const request = createRequest('1', 'test', {});
        const notification = createNotification('test', {});

        assert.ok(!isJsonRpcNotification(request));
        assert.ok(isJsonRpcNotification(notification));
    });
});
