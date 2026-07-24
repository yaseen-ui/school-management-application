import { NextRequest } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { prisma } from '@/lib/backend/lib/prisma.js'

export async function GET(req: NextRequest) {
  return invokeBackendController({
    getChannels: async (req: any, res: any) => {
      try {
        const channels = await prisma.channelConfiguration.findMany({
          where: { tenantId: req.tenantId },
        });
        const { default: responseHandler } = await import('@/lib/backend/utils/responseHandler.js');
        return responseHandler(res, 'success', channels, 'Channels retrieved successfully.');
      } catch (error: any) {
        const { default: responseHandler } = await import('@/lib/backend/utils/responseHandler.js');
        return responseHandler(res, 'fail', null, error.message);
      }
    }
  }, 'getChannels', req)
}

export async function PATCH(req: NextRequest) {
  return invokeBackendController({
    updateChannels: async (req: any, res: any) => {
      try {
        const { channels } = req.body;
        if (!channels || !Array.isArray(channels)) {
          const { default: responseHandler } = await import('@/lib/backend/utils/responseHandler.js');
          return responseHandler(res, 'fail', null, 'channels array is required');
        }
        const results = [];
        for (const ch of channels) {
          const existing = await prisma.channelConfiguration.findFirst({
            where: { tenantId: req.tenantId, channel: ch.channel },
          });
          if (existing) {
            const updated = await prisma.channelConfiguration.update({
              where: { id: existing.id, tenantId: req.tenantId },
              data: {
                provider: ch.provider || existing.provider,
                config: ch.config || existing.config,
                isEnabled: ch.isEnabled !== undefined ? ch.isEnabled : existing.isEnabled,
              },
            });
            results.push(updated);
          } else {
            const created = await prisma.channelConfiguration.create({
              data: {
                tenantId: req.tenantId,
                channel: ch.channel,
                provider: ch.provider || null,
                config: ch.config || {},
                isEnabled: ch.isEnabled !== undefined ? ch.isEnabled : false,
              },
            });
            results.push(created);
          }
        }
        const { default: responseHandler } = await import('@/lib/backend/utils/responseHandler.js');
        return responseHandler(res, 'success', results, 'Channels updated successfully.');
      } catch (error: any) {
        const { default: responseHandler } = await import('@/lib/backend/utils/responseHandler.js');
        return responseHandler(res, 'fail', null, error.message);
      }
    }
  }, 'updateChannels', req)
}