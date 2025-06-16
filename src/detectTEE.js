import { readFile, access } from 'fs/promises';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec);

// Check CPU flags
async function checkCpuInfoFlags() {
    const cpuinfo = await readFile('/proc/cpuinfo', 'utf8');
    const match = cpuinfo.match(/^flags\s+: (.*)$/m);
    const flags = match ? match[1].split(' ') : [];
    return {
        hasSGX: flags.includes('sgx'),
        hasTDX: flags.includes('tdx'),
    };
}

// Check if SGX device nodes exist
async function checkSGXDeviceFiles() {
    const sgxPaths = [
        '/dev/isgx',
        '/dev/sgx_enclave',
        '/dev/sgx_provision',
        '/dev/sgx'
    ];
    for (const path of sgxPaths) {
        try {
            await access(path);
            return true;
        } catch (_) {}
    }
    return false;
}

// Check kernel modules
async function checkKernelModules() {
    try {
        const { stdout } = await exec('lsmod');
        return /sgx|isgx/.test(stdout);
    } catch (_) {
        return false;
    }
}

// Attempt to check if the current process is running inside SGX (heuristic)
async function checkIfInsideSGX() {
    try {
        // SGX enclaves generally cannot access /proc or many syscalls
        await readFile('/proc/self/status', 'utf8');
        return false;
    } catch (err) {
        // If access is blocked (EPERM, ENOENT), we may be inside a restricted TEE
        return true;
    }
}

// Main detection function
export async function detectTEE() {
    const { hasSGX, hasTDX } = await checkCpuInfoFlags();
    const sgxDev = await checkSGXDeviceFiles();
    const sgxMod = await checkKernelModules();
    const insideTEE = await checkIfInsideSGX();

    const teeAvailable = hasSGX || sgxDev || sgxMod || hasTDX;

    if (insideTEE) {
        return '✅ Running inside a TEE (likely SGX/TDX)';
    } else if (teeAvailable) {
        return '✅ TEE available on system, but current process is *not* inside a TEE';
    } else {
        return '❌ No TEE (SGX/TDX) detected';
    }
}


export default {
 getInfo: detectTEE
}