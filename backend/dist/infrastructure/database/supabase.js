"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.supabaseAdmin = exports.CreateSupabaseClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const logger_1 = require("../../shared/utils/logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const supabaseService = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseKey) {
    logger_1.Logger.error('Missing Supabase credentials', {
        url: supabaseUrl ? 'present' : 'missing',
        key: supabaseKey ? 'present' : 'missing',
    });
    throw new Error('SUPABASE_URL and SUPABASE_PUBLISHABLE_DEFAULT_KEY are required in .env');
}
logger_1.Logger.info('Initializing Supabase clients');
const CreateSupabaseClient = (jwt) => {
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    });
};
exports.CreateSupabaseClient = CreateSupabaseClient;
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseService);
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
logger_1.Logger.info('Supabase clients initialized');
