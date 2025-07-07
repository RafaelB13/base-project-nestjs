import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class AppService {
  async getSystemInfo() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    function cpuAverage() {
      const cpus = os.cpus();
      let totalIdle = 0,
        totalTick = 0;
      for (const cpu of cpus) {
        for (const type in cpu.times) {
          totalTick += cpu.times[type as keyof typeof cpu.times];
        }
        totalIdle += cpu.times.idle;
      }
      return {
        idle: totalIdle / cpus.length,
        total: totalTick / cpus.length,
      };
    }

    const start = cpuAverage();
    await new Promise((res) => setTimeout(res, 100));
    const end = cpuAverage();
    const idleDiff = end.idle - start.idle;
    const totalDiff = end.total - start.total;
    const cpuUsage =
      totalDiff > 0 ? Number(((1 - idleDiff / totalDiff) * 100).toFixed(1)) : 0;

    return {
      status: 'ok',
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      cpu: {
        model: cpus[0]?.model || 'unknown',
        cores: cpus.length,
        speedGHz: cpus[0]?.speed
          ? Number((cpus[0].speed / 1000).toFixed(2))
          : null,
        usagePercent: cpuUsage,
      },
      memory: {
        totalGB: Number((totalMem / 1024 / 1024 / 1024).toFixed(2)),
        freeGB: Number((freeMem / 1024 / 1024 / 1024).toFixed(2)),
        usedGB: Number((usedMem / 1024 / 1024 / 1024).toFixed(2)),
        usagePercent: Number(((usedMem / totalMem) * 100).toFixed(1)),
      },
    };
  }
}
