const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');

const frontend = spawn('npm', ['run', 'dev:frontend'], { cwd: root, shell: true, stdio: 'inherit' });
const backend = spawn('npm', ['run', 'dev:backend'], { cwd: root, shell: true, stdio: 'inherit' });

frontend.on('exit', (code) => {
  if (code !== 0) backend.kill();
});

backend.on('exit', (code) => {
  if (code !== 0) frontend.kill();
});
