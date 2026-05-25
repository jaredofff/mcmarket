import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';

export interface DiscordMember {
  user: { id: string; username: string };
  roles: string[];
}

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);
  private readonly botToken = process.env.DISCORD_BOT_TOKEN;
  private readonly guildId = process.env.DISCORD_GUILD_ID;
  private readonly baseUrl = 'https://discord.com/api/v10';

  constructor() {
    if (!this.botToken || !this.guildId) {
      this.logger.warn(
        'Discord bot token or guild ID not configured. Discord features will be disabled.',
      );
    }
  }

  /**
   * Asigna un rol a un usuario en Discord
   */
  async assignRole(
    discordId: string,
    roleId: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.botToken || !this.guildId) {
      throw new BadRequestException('Discord service is not configured');
    }

    try {
      const url = `${this.baseUrl}/guilds/${this.guildId}/members/${discordId}/roles/${roleId}`;

      await axios.put(url, {}, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(
        `Role ${roleId} asignado a usuario ${discordId}`,
      );

      return {
        success: true,
        message: `Role assigned successfully to user ${discordId}`,
      };
    } catch (error: any) {
      this.logger.error(
        `Error assigning role to ${discordId}: ${error.message}`,
      );

      if (error.response?.status === 404) {
        throw new BadRequestException(
          'User not found in Discord server or role does not exist',
        );
      }

      throw new BadRequestException(`Failed to assign role: ${error.message}`);
    }
  }

  /**
   * Remueve un rol de un usuario en Discord
   */
  async removeRole(
    discordId: string,
    roleId: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!this.botToken || !this.guildId) {
      throw new BadRequestException('Discord service is not configured');
    }

    try {
      const url = `${this.baseUrl}/guilds/${this.guildId}/members/${discordId}/roles/${roleId}`;

      await axios.delete(url, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
          'Content-Type': 'application/json',
        },
      });

      this.logger.log(
        `Role ${roleId} removido del usuario ${discordId}`,
      );

      return {
        success: true,
        message: `Role removed successfully from user ${discordId}`,
      };
    } catch (error: any) {
      this.logger.error(
        `Error removing role from ${discordId}: ${error.message}`,
      );

      if (error.response?.status === 404) {
        throw new BadRequestException(
          'User not found in Discord server or role does not exist',
        );
      }

      throw new BadRequestException(
        `Failed to remove role: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene información de un miembro en Discord
   */
  async getMember(discordId: string): Promise<DiscordMember> {
    if (!this.botToken || !this.guildId) {
      throw new BadRequestException('Discord service is not configured');
    }

    try {
      const url = `${this.baseUrl}/guilds/${this.guildId}/members/${discordId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
        },
      });

      return response.data;
    } catch (error: any) {
      this.logger.error(`Error getting member ${discordId}: ${error.message}`);

      if (error.response?.status === 404) {
        throw new BadRequestException('User not found in Discord server');
      }

      throw new BadRequestException(`Failed to get member: ${error.message}`);
    }
  }

  /**
   * Obtiene info del rol
   */
  async getRole(roleId: string): Promise<any> {
    if (!this.botToken || !this.guildId) {
      throw new BadRequestException('Discord service is not configured');
    }

    try {
      const url = `${this.baseUrl}/guilds/${this.guildId}/roles`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bot ${this.botToken}`,
        },
      });

      const role = response.data.find((r: any) => r.id === roleId);

      if (!role) {
        throw new BadRequestException('Role not found');
      }

      return role;
    } catch (error: any) {
      this.logger.error(`Error getting role ${roleId}: ${error.message}`);
      throw new BadRequestException(`Failed to get role: ${error.message}`);
    }
  }

  /**
   * Verifica si un usuario ya tiene el rol
   */
  async hasRole(discordId: string, roleId: string): Promise<boolean> {
    try {
      const member = await this.getMember(discordId);
      return member.roles.includes(roleId);
    } catch {
      return false;
    }
  }
}
