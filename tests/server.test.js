/**
 * Server Entry Point Tests
 * Tests for server.js startup and shutdown functionality
 */

const { expect } = require('chai');
const { spawn } = require('child_process');
const http = require('http');

describe('Server Entry Point', () => {
  let serverProcess;

  afterEach((done) => {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      serverProcess.on('exit', () => {
        done();
      });
    } else {
      done();
    }
  });

  it('should start server and connect to database', function(done) {
    this.timeout(10000); // Allow time for server startup

    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: '3001' }
    });

    let output = '';
    let errorOutput = '';

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      
      // Check for successful startup messages
      if (output.includes('Database connection established successfully') &&
          output.includes('Server is running on port 3001')) {
        done();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    serverProcess.on('error', (error) => {
      done(error);
    });

    serverProcess.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        done(new Error(`Server exited with code ${code}. Error: ${errorOutput}`));
      }
    });
  });

  it('should respond to health check endpoint', function(done) {
    this.timeout(10000);

    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: '3002' }
    });

    let output = '';

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      
      if (output.includes('Server is running on port 3002')) {
        // Server is ready, make health check request
        http.get('http://localhost:3002/health', (res) => {
          expect(res.statusCode).to.equal(200);
          done();
        }).on('error', (err) => {
          done(err);
        });
      }
    });

    serverProcess.on('error', (error) => {
      done(error);
    });
  });

  it('should handle graceful shutdown on SIGTERM', function(done) {
    this.timeout(10000);

    serverProcess = spawn('node', ['server.js'], {
      env: { ...process.env, PORT: '3003' }
    });

    let output = '';

    serverProcess.stdout.on('data', (data) => {
      output += data.toString();
      
      if (output.includes('Server is running on port 3003')) {
        // Server is ready, send SIGTERM
        serverProcess.kill('SIGTERM');
      }
      
      if (output.includes('SIGTERM received') &&
          output.includes('Graceful shutdown completed')) {
        done();
      }
    });

    serverProcess.on('error', (error) => {
      done(error);
    });
  });
});
