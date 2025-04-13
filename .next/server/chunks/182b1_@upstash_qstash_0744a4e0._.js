module.exports = {

"[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-G7CVCBTL.mjs [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/receiver.ts
__turbopack_context__.s({
    "BaseProvider": (()=>BaseProvider),
    "Chat": (()=>Chat),
    "Client": (()=>Client),
    "DisabledWorkflowContext": (()=>DisabledWorkflowContext),
    "Messages": (()=>Messages),
    "QStashWorkflowAbort": (()=>QStashWorkflowAbort),
    "QStashWorkflowError": (()=>QStashWorkflowError),
    "QstashChatRatelimitError": (()=>QstashChatRatelimitError),
    "QstashDailyRatelimitError": (()=>QstashDailyRatelimitError),
    "QstashError": (()=>QstashError),
    "QstashRatelimitError": (()=>QstashRatelimitError),
    "Receiver": (()=>Receiver),
    "Schedules": (()=>Schedules),
    "SignatureError": (()=>SignatureError),
    "StepTypes": (()=>StepTypes),
    "UrlGroups": (()=>UrlGroups),
    "Workflow": (()=>Workflow),
    "WorkflowContext": (()=>WorkflowContext),
    "WorkflowLogger": (()=>WorkflowLogger),
    "anthropic": (()=>anthropic),
    "custom": (()=>custom),
    "decodeBase64": (()=>decodeBase64),
    "formatWorkflowError": (()=>formatWorkflowError),
    "openai": (()=>openai),
    "processOptions": (()=>processOptions),
    "serve": (()=>serve),
    "setupAnalytics": (()=>setupAnalytics),
    "upstash": (()=>upstash)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$5$2e$10$2e$0$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/jose@5.10.0/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/crypto-js@4.2.0/node_modules/crypto-js/index.js [app-route] (ecmascript)");
// src/client/workflow/context.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/neverthrow@7.2.0/node_modules/neverthrow/dist/index.es.js [app-route] (ecmascript)");
;
;
var SignatureError = class extends Error {
    constructor(message){
        super(message);
        this.name = "SignatureError";
    }
};
var Receiver = class {
    currentSigningKey;
    nextSigningKey;
    constructor(config){
        this.currentSigningKey = config.currentSigningKey;
        this.nextSigningKey = config.nextSigningKey;
    }
    /**
   * Verify the signature of a request.
   *
   * Tries to verify the signature with the current signing key.
   * If that fails, maybe because you have rotated the keys recently, it will
   * try to verify the signature with the next signing key.
   *
   * If that fails, the signature is invalid and a `SignatureError` is thrown.
   */ async verify(request) {
        let payload;
        try {
            payload = await this.verifyWithKey(this.currentSigningKey, request);
        } catch  {
            payload = await this.verifyWithKey(this.nextSigningKey, request);
        }
        this.verifyBodyAndUrl(payload, request);
        return true;
    }
    /**
   * Verify signature with a specific signing key
   */ async verifyWithKey(key, request) {
        const jwt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$jose$40$5$2e$10$2e$0$2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(request.signature, new TextEncoder().encode(key), {
            issuer: "Upstash",
            clockTolerance: request.clockTolerance
        }).catch((error)=>{
            throw new SignatureError(error.message);
        });
        return jwt.payload;
    }
    verifyBodyAndUrl(payload, request) {
        const p = payload;
        if (request.url !== void 0 && p.sub !== request.url) {
            throw new SignatureError(`invalid subject: ${p.sub}, want: ${request.url}`);
        }
        const bodyHash = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].SHA256(request.body).toString(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$crypto$2d$js$40$4$2e$2$2e$0$2f$node_modules$2f$crypto$2d$js$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].enc.Base64url);
        const padding = new RegExp(/=+$/);
        if (p.body.replace(padding, "") !== bodyHash.replace(padding, "")) {
            throw new SignatureError(`body hash does not match, want: ${p.body}, got: ${bodyHash}`);
        }
    }
};
// src/client/dlq.ts
var DLQ = class {
    http;
    constructor(http){
        this.http = http;
    }
    /**
   * List messages in the dlq
   */ async listMessages(options) {
        const filterPayload = {
            ...options?.filter,
            topicName: options?.filter?.urlGroup
        };
        const messagesPayload = await this.http.request({
            method: "GET",
            path: [
                "v2",
                "dlq"
            ],
            query: {
                cursor: options?.cursor,
                count: options?.count,
                ...filterPayload
            }
        });
        return {
            messages: messagesPayload.messages.map((message)=>{
                return {
                    ...message,
                    urlGroup: message.topicName,
                    ratePerSecond: "rate" in message ? message.rate : void 0
                };
            }),
            cursor: messagesPayload.cursor
        };
    }
    /**
   * Remove a message from the dlq using it's `dlqId`
   */ async delete(dlqMessageId) {
        return await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "dlq",
                dlqMessageId
            ],
            parseResponseAsJson: false
        });
    }
    /**
   * Remove multiple messages from the dlq using their `dlqId`s
   */ async deleteMany(request) {
        return await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "dlq"
            ],
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                dlqIds: request.dlqIds
            })
        });
    }
};
// src/client/error.ts
var RATELIMIT_STATUS = 429;
var QstashError = class extends Error {
    status;
    constructor(message, status){
        super(message);
        this.name = "QstashError";
        this.status = status;
    }
};
var QstashRatelimitError = class extends QstashError {
    limit;
    remaining;
    reset;
    constructor(args){
        super(`Exceeded burst rate limit. ${JSON.stringify(args)}`, RATELIMIT_STATUS);
        this.name = "QstashRatelimitError";
        this.limit = args.limit;
        this.remaining = args.remaining;
        this.reset = args.reset;
    }
};
var QstashChatRatelimitError = class extends QstashError {
    limitRequests;
    limitTokens;
    remainingRequests;
    remainingTokens;
    resetRequests;
    resetTokens;
    constructor(args){
        super(`Exceeded chat rate limit. ${JSON.stringify(args)}`, RATELIMIT_STATUS);
        this.name = "QstashChatRatelimitError";
        this.limitRequests = args["limit-requests"];
        this.limitTokens = args["limit-tokens"];
        this.remainingRequests = args["remaining-requests"];
        this.remainingTokens = args["remaining-tokens"];
        this.resetRequests = args["reset-requests"];
        this.resetTokens = args["reset-tokens"];
    }
};
var QstashDailyRatelimitError = class extends QstashError {
    limit;
    remaining;
    reset;
    constructor(args){
        super(`Exceeded daily rate limit. ${JSON.stringify(args)}`, RATELIMIT_STATUS);
        this.name = "QstashDailyRatelimitError";
        this.limit = args.limit;
        this.remaining = args.remaining;
        this.reset = args.reset;
    }
};
var QStashWorkflowError = class extends QstashError {
    constructor(message){
        super(message);
        this.name = "QStashWorkflowError";
    }
};
var QStashWorkflowAbort = class extends Error {
    stepInfo;
    stepName;
    constructor(stepName, stepInfo){
        super(`This is an Upstash Workflow error thrown after a step executes. It is expected to be raised. Make sure that you await for each step. Also, if you are using try/catch blocks, you should not wrap context.run/sleep/sleepUntil/call methods with try/catch. Aborting workflow after executing step '${stepName}'.`);
        this.name = "QStashWorkflowAbort";
        this.stepName = stepName;
        this.stepInfo = stepInfo;
    }
};
var formatWorkflowError = (error)=>{
    return error instanceof Error ? {
        error: error.name,
        message: error.message
    } : {
        error: "Error",
        message: "An error occured while executing workflow."
    };
};
// src/client/http.ts
var HttpClient = class {
    baseUrl;
    authorization;
    options;
    retry;
    headers;
    telemetryHeaders;
    constructor(config){
        this.baseUrl = config.baseUrl.replace(/\/$/, "");
        this.authorization = config.authorization;
        this.retry = typeof config.retry === "boolean" && !config.retry ? {
            attempts: 1,
            backoff: ()=>0
        } : {
            attempts: config.retry?.retries ?? 5,
            backoff: config.retry?.backoff ?? ((retryCount)=>Math.exp(retryCount) * 50)
        };
        this.headers = config.headers;
        this.telemetryHeaders = config.telemetryHeaders;
    }
    async request(request) {
        const { response } = await this.requestWithBackoff(request);
        if (request.parseResponseAsJson === false) {
            return void 0;
        }
        return await response.json();
    }
    async *requestStream(request) {
        const { response } = await this.requestWithBackoff(request);
        if (!response.body) {
            throw new Error("No response body");
        }
        const body = response.body;
        const reader = body.getReader();
        const decoder = new TextDecoder();
        try {
            while(true){
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                const chunkText = decoder.decode(value, {
                    stream: true
                });
                const chunks = chunkText.split("\n").filter(Boolean);
                for (const chunk of chunks){
                    if (chunk.startsWith("data: ")) {
                        const data = chunk.slice(6);
                        if (data === "[DONE]") {
                            break;
                        }
                        yield JSON.parse(data);
                    }
                }
            }
        } finally{
            await reader.cancel();
        }
    }
    requestWithBackoff = async (request)=>{
        const [url, requestOptions] = this.processRequest(request);
        let response = void 0;
        let error = void 0;
        for(let index = 0; index <= this.retry.attempts; index++){
            try {
                response = await fetch(url.toString(), requestOptions);
                break;
            } catch (error_) {
                error = error_;
                if (index < this.retry.attempts) {
                    await new Promise((r)=>setTimeout(r, this.retry.backoff(index)));
                }
            }
        }
        if (!response) {
            throw error ?? new Error("Exhausted all retries");
        }
        await this.checkResponse(response);
        return {
            response,
            error
        };
    };
    processRequest = (request)=>{
        const headers = new Headers(request.headers);
        if (!headers.has("Authorization")) {
            headers.set("Authorization", this.authorization);
        }
        const requestOptions = {
            method: request.method,
            headers,
            body: request.body,
            keepalive: request.keepalive
        };
        const url = new URL([
            request.baseUrl ?? this.baseUrl,
            ...request.path
        ].join("/"));
        if (request.query) {
            for (const [key, value] of Object.entries(request.query)){
                if (value !== void 0) {
                    url.searchParams.set(key, value.toString());
                }
            }
        }
        return [
            url.toString(),
            requestOptions
        ];
    };
    async checkResponse(response) {
        if (response.status === 429) {
            if (response.headers.get("x-ratelimit-limit-requests")) {
                throw new QstashChatRatelimitError({
                    "limit-requests": response.headers.get("x-ratelimit-limit-requests"),
                    "limit-tokens": response.headers.get("x-ratelimit-limit-tokens"),
                    "remaining-requests": response.headers.get("x-ratelimit-remaining-requests"),
                    "remaining-tokens": response.headers.get("x-ratelimit-remaining-tokens"),
                    "reset-requests": response.headers.get("x-ratelimit-reset-requests"),
                    "reset-tokens": response.headers.get("x-ratelimit-reset-tokens")
                });
            } else if (response.headers.get("RateLimit-Limit")) {
                throw new QstashDailyRatelimitError({
                    limit: response.headers.get("RateLimit-Limit"),
                    remaining: response.headers.get("RateLimit-Remaining"),
                    reset: response.headers.get("RateLimit-Reset")
                });
            }
            throw new QstashRatelimitError({
                limit: response.headers.get("Burst-RateLimit-Limit"),
                remaining: response.headers.get("Burst-RateLimit-Remaining"),
                reset: response.headers.get("Burst-RateLimit-Reset")
            });
        }
        if (response.status < 200 || response.status >= 300) {
            const body = await response.text();
            throw new QstashError(body.length > 0 ? body : `Error: status=${response.status}`, response.status);
        }
    }
};
// src/client/llm/providers.ts
var setupAnalytics = (analytics, providerApiKey, providerBaseUrl, provider)=>{
    if (!analytics) return {};
    switch(analytics.name){
        case "helicone":
            {
                switch(provider){
                    case "upstash":
                        {
                            return {
                                baseURL: "https://qstash.helicone.ai/llm/v1/chat/completions",
                                defaultHeaders: {
                                    "Helicone-Auth": `Bearer ${analytics.token}`,
                                    Authorization: `Bearer ${providerApiKey}`
                                }
                            };
                        }
                    default:
                        {
                            return {
                                baseURL: "https://gateway.helicone.ai/v1/chat/completions",
                                defaultHeaders: {
                                    "Helicone-Auth": `Bearer ${analytics.token}`,
                                    "Helicone-Target-Url": providerBaseUrl,
                                    Authorization: `Bearer ${providerApiKey}`
                                }
                            };
                        }
                }
            }
        default:
            {
                throw new Error("Unknown analytics provider");
            }
    }
};
// src/client/llm/chat.ts
var Chat = class _Chat {
    http;
    token;
    constructor(http, token){
        this.http = http;
        this.token = token;
    }
    static toChatRequest(request) {
        const messages = [];
        messages.push({
            role: "system",
            content: request.system
        }, {
            role: "user",
            content: request.user
        });
        const chatRequest = {
            ...request,
            messages
        };
        return chatRequest;
    }
    /**
   * Calls the Upstash completions api given a ChatRequest.
   *
   * Returns a ChatCompletion or a stream of ChatCompletionChunks
   * if stream is enabled.
   *
   * @param request ChatRequest with messages
   * @returns Chat completion or stream
   */ create = async (request)=>{
        if (request.provider.owner != "upstash") return this.createThirdParty(request);
        const body = JSON.stringify(request);
        let baseUrl = void 0;
        let headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
            ..."stream" in request && request.stream ? {
                Connection: "keep-alive",
                Accept: "text/event-stream",
                "Cache-Control": "no-cache"
            } : {}
        };
        if (request.analytics) {
            const { baseURL, defaultHeaders } = setupAnalytics({
                name: "helicone",
                token: request.analytics.token
            }, this.getAuthorizationToken(), request.provider.baseUrl, "upstash");
            headers = {
                ...headers,
                ...defaultHeaders
            };
            baseUrl = baseURL;
        }
        const path = request.analytics ? [] : [
            "llm",
            "v1",
            "chat",
            "completions"
        ];
        return "stream" in request && request.stream ? this.http.requestStream({
            path,
            method: "POST",
            headers,
            baseUrl,
            body
        }) : this.http.request({
            path,
            method: "POST",
            headers,
            baseUrl,
            body
        });
    };
    /**
   * Calls the Upstash completions api given a ChatRequest.
   *
   * Returns a ChatCompletion or a stream of ChatCompletionChunks
   * if stream is enabled.
   *
   * @param request ChatRequest with messages
   * @returns Chat completion or stream
   */ createThirdParty = async (request)=>{
        const { baseUrl, token, owner, organization } = request.provider;
        if (owner === "upstash") throw new Error("Upstash is not 3rd party provider!");
        delete request.provider;
        delete request.system;
        const analytics = request.analytics;
        delete request.analytics;
        const body = JSON.stringify(request);
        const isAnalyticsEnabled = analytics?.name && analytics.token;
        const analyticsConfig = analytics?.name && analytics.token ? setupAnalytics({
            name: analytics.name,
            token: analytics.token
        }, token, baseUrl, owner) : {
            defaultHeaders: void 0,
            baseURL: baseUrl
        };
        const isStream = "stream" in request && request.stream;
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...organization ? {
                "OpenAI-Organization": organization
            } : {},
            ...isStream ? {
                Connection: "keep-alive",
                Accept: "text/event-stream",
                "Cache-Control": "no-cache"
            } : {},
            ...analyticsConfig.defaultHeaders
        };
        const response = await this.http[isStream ? "requestStream" : "request"]({
            path: isAnalyticsEnabled ? [] : [
                "v1",
                "chat",
                "completions"
            ],
            method: "POST",
            headers,
            body,
            baseUrl: analyticsConfig.baseURL
        });
        return response;
    };
    // Helper method to get the authorization token
    getAuthorizationToken() {
        const authHeader = String(this.http.authorization);
        const match = /Bearer (.+)/.exec(authHeader);
        if (!match) {
            throw new Error("Invalid authorization header format");
        }
        return match[1];
    }
    /**
   * Calls the Upstash completions api given a PromptRequest.
   *
   * Returns a ChatCompletion or a stream of ChatCompletionChunks
   * if stream is enabled.
   *
   * @param request PromptRequest with system and user messages.
   *    Note that system parameter shouldn't be passed in the case of
   *    mistralai/Mistral-7B-Instruct-v0.2 model.
   * @returns Chat completion or stream
   */ prompt = async (request)=>{
        const chatRequest = _Chat.toChatRequest(request);
        return this.create(chatRequest);
    };
};
// src/client/messages.ts
var Messages = class {
    http;
    constructor(http){
        this.http = http;
    }
    /**
   * Get a message
   */ async get(messageId) {
        const messagePayload = await this.http.request({
            method: "GET",
            path: [
                "v2",
                "messages",
                messageId
            ]
        });
        const message = {
            ...messagePayload,
            urlGroup: messagePayload.topicName,
            ratePerSecond: "rate" in messagePayload ? messagePayload.rate : void 0
        };
        return message;
    }
    /**
   * Cancel a message
   */ async delete(messageId) {
        return await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "messages",
                messageId
            ],
            parseResponseAsJson: false
        });
    }
    async deleteMany(messageIds) {
        const result = await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "messages"
            ],
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messageIds
            })
        });
        return result.cancelled;
    }
    async deleteAll() {
        const result = await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "messages"
            ]
        });
        return result.cancelled;
    }
};
// src/client/api/base.ts
var BaseProvider = class {
    baseUrl;
    token;
    owner;
    constructor(baseUrl, token, owner){
        this.baseUrl = baseUrl;
        this.token = token;
        this.owner = owner;
    }
    getUrl() {
        return `${this.baseUrl}/${this.getRoute().join("/")}`;
    }
};
// src/client/api/llm.ts
var LLMProvider = class extends BaseProvider {
    apiKind = "llm";
    organization;
    method = "POST";
    constructor(baseUrl, token, owner, organization){
        super(baseUrl, token, owner);
        this.organization = organization;
    }
    getRoute() {
        return this.owner === "anthropic" ? [
            "v1",
            "messages"
        ] : [
            "v1",
            "chat",
            "completions"
        ];
    }
    getHeaders(options) {
        if (this.owner === "upstash" && !options.analytics) {
            return {
                "content-type": "application/json"
            };
        }
        const header = this.owner === "anthropic" ? "x-api-key" : "authorization";
        const headerValue = this.owner === "anthropic" ? this.token : `Bearer ${this.token}`;
        const headers = {
            [header]: headerValue,
            "content-type": "application/json"
        };
        if (this.owner === "openai" && this.organization) {
            headers["OpenAI-Organization"] = this.organization;
        }
        if (this.owner === "anthropic") {
            headers["anthropic-version"] = "2023-06-01";
        }
        return headers;
    }
    /**
   * Checks if callback exists and adds analytics in place if it's set.
   *
   * @param request
   * @param options
   */ onFinish(providerInfo, options) {
        if (options.analytics) {
            return updateWithAnalytics(providerInfo, options.analytics);
        }
        return providerInfo;
    }
};
var upstash = ()=>{
    return new LLMProvider("https://qstash.upstash.io/llm", "", "upstash");
};
var openai = ({ token, organization })=>{
    return new LLMProvider("https://api.openai.com", token, "openai", organization);
};
var anthropic = ({ token })=>{
    return new LLMProvider("https://api.anthropic.com", token, "anthropic");
};
var custom = ({ baseUrl, token })=>{
    const trimmedBaseUrl = baseUrl.replace(/\/(v1\/)?chat\/completions$/, "");
    return new LLMProvider(trimmedBaseUrl, token, "custom");
};
// src/client/api/utils.ts
var getProviderInfo = (api, upstashToken)=>{
    const { name, provider, ...parameters } = api;
    const finalProvider = provider ?? upstash();
    if (finalProvider.owner === "upstash" && !finalProvider.token) {
        finalProvider.token = upstashToken;
    }
    if (!finalProvider.baseUrl) throw new TypeError("baseUrl cannot be empty or undefined!");
    if (!finalProvider.token) throw new TypeError("token cannot be empty or undefined!");
    if (finalProvider.apiKind !== name) {
        throw new TypeError(`Unexpected api name. Expected '${finalProvider.apiKind}', received ${name}`);
    }
    const providerInfo = {
        url: finalProvider.getUrl(),
        baseUrl: finalProvider.baseUrl,
        route: finalProvider.getRoute(),
        appendHeaders: finalProvider.getHeaders(parameters),
        owner: finalProvider.owner,
        method: finalProvider.method
    };
    return finalProvider.onFinish(providerInfo, parameters);
};
var safeJoinHeaders = (headers, record)=>{
    const joinedHeaders = new Headers(record);
    for (const [header, value] of headers.entries()){
        joinedHeaders.set(header, value);
    }
    return joinedHeaders;
};
var processApi = (request, headers, upstashToken)=>{
    if (!request.api) {
        request.headers = headers;
        return request;
    }
    const { url, appendHeaders, owner, method } = getProviderInfo(request.api, upstashToken);
    if (request.api.name === "llm") {
        const callback = request.callback;
        if (!callback) {
            throw new TypeError("Callback cannot be undefined when using LLM api.");
        }
        return {
            ...request,
            method: request.method ?? method,
            headers: safeJoinHeaders(headers, appendHeaders),
            ...owner === "upstash" && !request.api.analytics ? {
                api: {
                    name: "llm"
                },
                url: void 0,
                callback
            } : {
                url,
                api: void 0
            }
        };
    } else {
        return {
            ...request,
            method: request.method ?? method,
            headers: safeJoinHeaders(headers, appendHeaders),
            url,
            api: void 0
        };
    }
};
function updateWithAnalytics(providerInfo, analytics) {
    switch(analytics.name){
        case "helicone":
            {
                providerInfo.appendHeaders["Helicone-Auth"] = `Bearer ${analytics.token}`;
                if (providerInfo.owner === "upstash") {
                    updateProviderInfo(providerInfo, "https://qstash.helicone.ai", [
                        "llm",
                        ...providerInfo.route
                    ]);
                } else {
                    providerInfo.appendHeaders["Helicone-Target-Url"] = providerInfo.baseUrl;
                    updateProviderInfo(providerInfo, "https://gateway.helicone.ai", providerInfo.route);
                }
                return providerInfo;
            }
        default:
            {
                throw new Error("Unknown analytics provider");
            }
    }
}
function updateProviderInfo(providerInfo, baseUrl, route) {
    providerInfo.baseUrl = baseUrl;
    providerInfo.route = route;
    providerInfo.url = `${baseUrl}/${route.join("/")}`;
}
// src/client/utils.ts
var isIgnoredHeader = (header)=>{
    const lowerCaseHeader = header.toLowerCase();
    return lowerCaseHeader.startsWith("content-type") || lowerCaseHeader.startsWith("upstash-");
};
function prefixHeaders(headers) {
    const keysToBePrefixed = [
        ...headers.keys()
    ].filter((key)=>!isIgnoredHeader(key));
    for (const key of keysToBePrefixed){
        const value = headers.get(key);
        if (value !== null) {
            headers.set(`Upstash-Forward-${key}`, value);
        }
        headers.delete(key);
    }
    return headers;
}
function wrapWithGlobalHeaders(headers, globalHeaders, telemetryHeaders) {
    if (!globalHeaders) {
        return headers;
    }
    const finalHeaders = new Headers(globalHeaders);
    headers.forEach((value, key)=>{
        finalHeaders.set(key, value);
    });
    telemetryHeaders?.forEach((value, key)=>{
        if (!value) return;
        finalHeaders.append(key, value);
    });
    return finalHeaders;
}
function processHeaders(request) {
    const headers = prefixHeaders(new Headers(request.headers));
    headers.set("Upstash-Method", request.method ?? "POST");
    if (request.delay !== void 0) {
        if (typeof request.delay === "string") {
            headers.set("Upstash-Delay", request.delay);
        } else {
            headers.set("Upstash-Delay", `${request.delay.toFixed(0)}s`);
        }
    }
    if (request.notBefore !== void 0) {
        headers.set("Upstash-Not-Before", request.notBefore.toFixed(0));
    }
    if (request.deduplicationId !== void 0) {
        headers.set("Upstash-Deduplication-Id", request.deduplicationId);
    }
    if (request.contentBasedDeduplication) {
        headers.set("Upstash-Content-Based-Deduplication", "true");
    }
    if (request.retries !== void 0) {
        headers.set("Upstash-Retries", request.retries.toFixed(0));
    }
    if (request.callback !== void 0) {
        headers.set("Upstash-Callback", request.callback);
    }
    if (request.failureCallback !== void 0) {
        headers.set("Upstash-Failure-Callback", request.failureCallback);
    }
    if (request.timeout !== void 0) {
        if (typeof request.timeout === "string") {
            headers.set("Upstash-Timeout", request.timeout);
        } else {
            headers.set("Upstash-Timeout", `${request.timeout}s`);
        }
    }
    if (request.flowControl?.key) {
        const parallelism = request.flowControl.parallelism?.toString();
        const rate = request.flowControl.ratePerSecond?.toString();
        const controlValue = [
            parallelism ? `parallelism=${parallelism}` : void 0,
            rate ? `rate=${rate}` : void 0
        ].filter(Boolean);
        if (controlValue.length === 0) {
            throw new QstashError("Provide at least one of parallelism or ratePerSecond for flowControl");
        }
        headers.set("Upstash-Flow-Control-Key", request.flowControl.key);
        headers.set("Upstash-Flow-Control-Value", controlValue.join(", "));
    }
    return headers;
}
function getRequestPath(request) {
    const nonApiPath = request.url ?? request.urlGroup ?? request.topic;
    if (nonApiPath) return nonApiPath;
    if (request.api?.name === "llm") return `api/llm`;
    if (request.api?.name === "email") {
        const providerInfo = getProviderInfo(request.api, "not-needed");
        return providerInfo.baseUrl;
    }
    throw new QstashError(`Failed to infer request path for ${JSON.stringify(request)}`);
}
var NANOID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
var NANOID_LENGTH = 21;
function nanoid() {
    return [
        ...crypto.getRandomValues(new Uint8Array(NANOID_LENGTH))
    ].map((x)=>NANOID_CHARS[x % NANOID_CHARS.length]).join("");
}
function decodeBase64(base64) {
    try {
        const binString = atob(base64);
        const intArray = Uint8Array.from(binString, (m)=>m.codePointAt(0));
        return new TextDecoder().decode(intArray);
    } catch (error) {
        try {
            const result = atob(base64);
            console.warn(`Upstash QStash: Failed while decoding base64 "${base64}". Decoding with atob and returning it instead. ${error}`);
            return result;
        } catch (error2) {
            console.warn(`Upstash QStash: Failed to decode base64 "${base64}" with atob. Returning it as it is. ${error2}`);
            return base64;
        }
    }
}
function getRuntime() {
    if (typeof process === "object" && typeof process.versions == "object" && process.versions.bun) return `bun@${process.versions.bun}`;
    if (typeof EdgeRuntime === "string") return "edge-light";
    else if (typeof process === "object" && typeof process.version === "string") return `node@${process.version}`;
    return "";
}
// src/client/queue.ts
var Queue = class {
    http;
    queueName;
    constructor(http, queueName){
        this.http = http;
        this.queueName = queueName;
    }
    /**
   * Create or update the queue
   */ async upsert(request) {
        if (!this.queueName) {
            throw new Error("Please provide a queue name to the Queue constructor");
        }
        const body = {
            queueName: this.queueName,
            parallelism: request.parallelism ?? 1,
            paused: request.paused ?? false
        };
        await this.http.request({
            method: "POST",
            path: [
                "v2",
                "queues"
            ],
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body),
            parseResponseAsJson: false
        });
    }
    /**
   * Get the queue details
   */ async get() {
        if (!this.queueName) {
            throw new Error("Please provide a queue name to the Queue constructor");
        }
        return await this.http.request({
            method: "GET",
            path: [
                "v2",
                "queues",
                this.queueName
            ]
        });
    }
    /**
   * List queues
   */ async list() {
        return await this.http.request({
            method: "GET",
            path: [
                "v2",
                "queues"
            ]
        });
    }
    /**
   * Delete the queue
   */ async delete() {
        if (!this.queueName) {
            throw new Error("Please provide a queue name to the Queue constructor");
        }
        await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "queues",
                this.queueName
            ],
            parseResponseAsJson: false
        });
    }
    /**
   * Enqueue a message to a queue.
   */ async enqueue(request) {
        if (!this.queueName) {
            throw new Error("Please provide a queue name to the Queue constructor");
        }
        const headers = wrapWithGlobalHeaders(processHeaders(request), this.http.headers, this.http.telemetryHeaders);
        const destination = getRequestPath(request);
        const response = await this.http.request({
            path: [
                "v2",
                "enqueue",
                this.queueName,
                destination
            ],
            body: request.body,
            headers,
            method: "POST"
        });
        return response;
    }
    /**
   * Enqueue a message to a queue, serializing the body to JSON.
   */ async enqueueJSON(request) {
        const headers = prefixHeaders(new Headers(request.headers));
        headers.set("Content-Type", "application/json");
        const upstashToken = String(this.http.authorization).split("Bearer ")[1];
        const nonApiRequest = processApi(request, headers, upstashToken);
        const response = await this.enqueue({
            ...nonApiRequest,
            body: JSON.stringify(nonApiRequest.body)
        });
        return response;
    }
    /**
   * Pauses the queue.
   *
   * A paused queue will not deliver messages until
   * it is resumed.
   */ async pause() {
        if (!this.queueName) {
            throw new Error("Please provide a queue name to the Queue constructor");
        }
        await this.http.request({
            method: "POST",
            path: [
                "v2",
                "queues",
                this.queueName,
                "pause"
            ],
            parseResponseAsJson: false
        });
    }
    /**
   * Resumes the queue.
   */ async resume() {
        if (!this.queueName) {
            throw new Error("Please provide a queue name to the Queue constructor");
        }
        await this.http.request({
            method: "POST",
            path: [
                "v2",
                "queues",
                this.queueName,
                "resume"
            ],
            parseResponseAsJson: false
        });
    }
};
// src/client/schedules.ts
var Schedules = class {
    http;
    constructor(http){
        this.http = http;
    }
    /**
   * Create a schedule
   */ async create(request) {
        const headers = prefixHeaders(new Headers(request.headers));
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }
        headers.set("Upstash-Cron", request.cron);
        if (request.method !== void 0) {
            headers.set("Upstash-Method", request.method);
        }
        if (request.delay !== void 0) {
            if (typeof request.delay === "string") {
                headers.set("Upstash-Delay", request.delay);
            } else {
                headers.set("Upstash-Delay", `${request.delay.toFixed(0)}s`);
            }
        }
        if (request.retries !== void 0) {
            headers.set("Upstash-Retries", request.retries.toFixed(0));
        }
        if (request.callback !== void 0) {
            headers.set("Upstash-Callback", request.callback);
        }
        if (request.failureCallback !== void 0) {
            headers.set("Upstash-Failure-Callback", request.failureCallback);
        }
        if (request.timeout !== void 0) {
            if (typeof request.timeout === "string") {
                headers.set("Upstash-Timeout", request.timeout);
            } else {
                headers.set("Upstash-Timeout", `${request.timeout}s`);
            }
        }
        if (request.scheduleId !== void 0) {
            headers.set("Upstash-Schedule-Id", request.scheduleId);
        }
        if (request.queueName !== void 0) {
            headers.set("Upstash-Queue-Name", request.queueName);
        }
        if (request.flowControl?.key) {
            const parallelism = request.flowControl.parallelism?.toString();
            const rate = request.flowControl.ratePerSecond?.toString();
            const controlValue = [
                parallelism ? `parallelism=${parallelism}` : void 0,
                rate ? `rate=${rate}` : void 0
            ].filter(Boolean);
            if (controlValue.length === 0) {
                throw new QstashError("Provide at least one of parallelism or ratePerSecond for flowControl");
            }
            headers.set("Upstash-Flow-Control-Key", request.flowControl.key);
            headers.set("Upstash-Flow-Control-Value", controlValue.join(", "));
        }
        return await this.http.request({
            method: "POST",
            headers: wrapWithGlobalHeaders(headers, this.http.headers, this.http.telemetryHeaders),
            path: [
                "v2",
                "schedules",
                request.destination
            ],
            body: request.body
        });
    }
    /**
   * Get a schedule
   */ async get(scheduleId) {
        const schedule = await this.http.request({
            method: "GET",
            path: [
                "v2",
                "schedules",
                scheduleId
            ]
        });
        if ("rate" in schedule) schedule.ratePerSecond = schedule.rate;
        return schedule;
    }
    /**
   * List your schedules
   */ async list() {
        const schedules = await this.http.request({
            method: "GET",
            path: [
                "v2",
                "schedules"
            ]
        });
        for (const schedule of schedules){
            if ("rate" in schedule) schedule.ratePerSecond = schedule.rate;
        }
        return schedules;
    }
    /**
   * Delete a schedule
   */ async delete(scheduleId) {
        return await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "schedules",
                scheduleId
            ],
            parseResponseAsJson: false
        });
    }
    /**
   * Pauses the schedule.
   *
   * A paused schedule will not deliver messages until
   * it is resumed.
   */ async pause({ schedule }) {
        await this.http.request({
            method: "PATCH",
            path: [
                "v2",
                "schedules",
                schedule,
                "pause"
            ],
            parseResponseAsJson: false
        });
    }
    /**
   * Resumes the schedule.
   */ async resume({ schedule }) {
        await this.http.request({
            method: "PATCH",
            path: [
                "v2",
                "schedules",
                schedule,
                "resume"
            ],
            parseResponseAsJson: false
        });
    }
};
// src/client/url-groups.ts
var UrlGroups = class {
    http;
    constructor(http){
        this.http = http;
    }
    /**
   * Create a new url group with the given name and endpoints
   */ async addEndpoints(request) {
        await this.http.request({
            method: "POST",
            path: [
                "v2",
                "topics",
                request.name,
                "endpoints"
            ],
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                endpoints: request.endpoints
            }),
            parseResponseAsJson: false
        });
    }
    /**
   * Remove endpoints from a url group.
   */ async removeEndpoints(request) {
        await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "topics",
                request.name,
                "endpoints"
            ],
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                endpoints: request.endpoints
            }),
            parseResponseAsJson: false
        });
    }
    /**
   * Get a list of all url groups.
   */ async list() {
        return await this.http.request({
            method: "GET",
            path: [
                "v2",
                "topics"
            ]
        });
    }
    /**
   * Get a single url group
   */ async get(name) {
        return await this.http.request({
            method: "GET",
            path: [
                "v2",
                "topics",
                name
            ]
        });
    }
    /**
   * Delete a url group
   */ async delete(name) {
        return await this.http.request({
            method: "DELETE",
            path: [
                "v2",
                "topics",
                name
            ],
            parseResponseAsJson: false
        });
    }
};
// version.ts
var VERSION = "v2.7.23";
// src/client/client.ts
var Client = class {
    http;
    token;
    constructor(config){
        const environment = typeof process === "undefined" ? {} : process.env;
        let baseUrl = (config?.baseUrl ?? environment.QSTASH_URL ?? "https://qstash.upstash.io").replace(/\/$/, "");
        if (baseUrl === "https://qstash.upstash.io/v2/publish") {
            baseUrl = "https://qstash.upstash.io";
        }
        const token = config?.token ?? environment.QSTASH_TOKEN;
        const enableTelemetry = environment.UPSTASH_DISABLE_TELEMETRY ? false : config?.enableTelemetry ?? true;
        const isCloudflare = typeof caches !== "undefined" && "default" in caches;
        const telemetryHeaders = new Headers(enableTelemetry ? {
            "Upstash-Telemetry-Sdk": `upstash-qstash-js@${VERSION}`,
            "Upstash-Telemetry-Platform": isCloudflare ? "cloudflare" : environment.VERCEL ? "vercel" : environment.AWS_REGION ? "aws" : "",
            "Upstash-Telemetry-Runtime": getRuntime()
        } : {});
        this.http = new HttpClient({
            retry: config?.retry,
            baseUrl,
            authorization: `Bearer ${token}`,
            //@ts-expect-error caused by undici and bunjs type overlap
            headers: prefixHeaders(new Headers(config?.headers ?? {})),
            //@ts-expect-error caused by undici and bunjs type overlap
            telemetryHeaders
        });
        if (!token) {
            console.warn("[Upstash QStash] client token is not set. Either pass a token or set QSTASH_TOKEN env variable.");
        }
        this.token = token;
    }
    /**
   * Access the urlGroup API.
   *
   * Create, read, update or delete urlGroups.
   */ get urlGroups() {
        return new UrlGroups(this.http);
    }
    /**
   * Deprecated. Use urlGroups instead.
   *
   * Access the topic API.
   *
   * Create, read, update or delete topics.
   */ get topics() {
        return this.urlGroups;
    }
    /**
   * Access the dlq API.
   *
   * List or remove messages from the DLQ.
   */ get dlq() {
        return new DLQ(this.http);
    }
    /**
   * Access the message API.
   *
   * Read or cancel messages.
   */ get messages() {
        return new Messages(this.http);
    }
    /**
   * Access the schedule API.
   *
   * Create, read or delete schedules.
   */ get schedules() {
        return new Schedules(this.http);
    }
    /**
   * Access the workflow API.
   *
   * cancel workflows.
   *
   * @deprecated as of version 2.7.17. Will be removed in qstash-js 3.0.0.
   * Please use @upstash/workflow instead https://github.com/upstash/workflow-js
   * Migration Guide: https://upstash.com/docs/workflow/migration
   */ get workflow() {
        return new Workflow(this.http);
    }
    /**
   * Access the queue API.
   *
   * Create, read, update or delete queues.
   */ queue(request) {
        return new Queue(this.http, request?.queueName);
    }
    /**
   * Access the Chat API
   *
   * Call the create or prompt methods
   */ chat() {
        return new Chat(this.http, this.token);
    }
    async publish(request) {
        const headers = wrapWithGlobalHeaders(processHeaders(request), this.http.headers, this.http.telemetryHeaders);
        const response = await this.http.request({
            path: [
                "v2",
                "publish",
                getRequestPath(request)
            ],
            body: request.body,
            headers,
            method: "POST"
        });
        return response;
    }
    /**
   * publishJSON is a utility wrapper around `publish` that automatically serializes the body
   * and sets the `Content-Type` header to `application/json`.
   */ async publishJSON(request) {
        const headers = prefixHeaders(new Headers(request.headers));
        headers.set("Content-Type", "application/json");
        const upstashToken = String(this.http.authorization).split("Bearer ")[1];
        const nonApiRequest = processApi(request, headers, upstashToken);
        const response = await this.publish({
            ...nonApiRequest,
            body: JSON.stringify(nonApiRequest.body)
        });
        return response;
    }
    /**
   * Batch publish messages to QStash.
   */ async batch(request) {
        const messages = [];
        for (const message of request){
            const headers = wrapWithGlobalHeaders(processHeaders(message), this.http.headers, this.http.telemetryHeaders);
            const headerEntries = Object.fromEntries(headers.entries());
            messages.push({
                destination: getRequestPath(message),
                headers: headerEntries,
                body: message.body,
                ...message.queueName && {
                    queue: message.queueName
                }
            });
        }
        const response = await this.http.request({
            path: [
                "v2",
                "batch"
            ],
            body: JSON.stringify(messages),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        });
        const arrayResposne = Array.isArray(response) ? response : [
            response
        ];
        return arrayResposne;
    }
    /**
   * Batch publish messages to QStash, serializing each body to JSON.
   */ async batchJSON(request) {
        const batchPayload = request.map((message)=>{
            if ("body" in message) {
                message.body = JSON.stringify(message.body);
            }
            const upstashToken = String(this.http.authorization).split("Bearer ")[1];
            const nonApiMessage = processApi(message, new Headers(message.headers), upstashToken);
            nonApiMessage.headers.set("Content-Type", "application/json");
            return nonApiMessage;
        });
        const response = await this.batch(batchPayload);
        return response;
    }
    /**
   * Retrieve your logs.
   *
   * The logs endpoint is paginated and returns only 100 logs at a time.
   * If you want to receive more logs, you can use the cursor to paginate.
   *
   * The cursor is a unix timestamp with millisecond precision
   *
   * @example
   * ```ts
   * let cursor = Date.now()
   * const logs: Log[] = []
   * while (cursor > 0) {
   *   const res = await qstash.logs({ cursor })
   *   logs.push(...res.logs)
   *   cursor = res.cursor ?? 0
   * }
   * ```
   */ async logs(request) {
        const query = {};
        if (typeof request?.cursor === "number" && request.cursor > 0) {
            query.cursor = request.cursor.toString();
        } else if (typeof request?.cursor === "string" && request.cursor !== "") {
            query.cursor = request.cursor;
        }
        for (const [key, value] of Object.entries(request?.filter ?? {})){
            if (typeof value === "number" && value < 0) {
                continue;
            }
            if (key === "urlGroup") {
                query.topicName = value.toString();
            } else if (typeof value !== "undefined") {
                query[key] = value.toString();
            }
        }
        const responsePayload = await this.http.request({
            path: [
                "v2",
                "events"
            ],
            method: "GET",
            query
        });
        const logs = responsePayload.events.map((event)=>{
            return {
                ...event,
                urlGroup: event.topicName
            };
        });
        return {
            cursor: responsePayload.cursor,
            logs,
            events: logs
        };
    }
    /**
   * @deprecated Will be removed in the next major release. Use the `logs` method instead.
   *
   * Retrieve your logs.
   *
   * The logs endpoint is paginated and returns only 100 logs at a time.
   * If you want to receive more logs, you can use the cursor to paginate.
   *
   * The cursor is a unix timestamp with millisecond precision
   *
   * @example
   * ```ts
   * let cursor = Date.now()
   * const logs: Log[] = []
   * while (cursor > 0) {
   *   const res = await qstash.logs({ cursor })
   *   logs.push(...res.logs)
   *   cursor = res.cursor ?? 0
   * }
   * ```
   */ async events(request) {
        return await this.logs(request);
    }
};
// src/client/workflow/constants.ts
var WORKFLOW_ID_HEADER = "Upstash-Workflow-RunId";
var WORKFLOW_INIT_HEADER = "Upstash-Workflow-Init";
var WORKFLOW_URL_HEADER = "Upstash-Workflow-Url";
var WORKFLOW_FAILURE_HEADER = "Upstash-Workflow-Is-Failure";
var WORKFLOW_PROTOCOL_VERSION = "1";
var WORKFLOW_PROTOCOL_VERSION_HEADER = "Upstash-Workflow-Sdk-Version";
var DEFAULT_CONTENT_TYPE = "application/json";
var NO_CONCURRENCY = 1;
var DEFAULT_RETRIES = 3;
;
;
// src/client/workflow/types.ts
var StepTypes = [
    "Initial",
    "Run",
    "SleepFor",
    "SleepUntil",
    "Call"
];
// src/client/workflow/workflow-requests.ts
var triggerFirstInvocation = async (workflowContext, retries, debug)=>{
    const headers = getHeaders("true", workflowContext.workflowRunId, workflowContext.url, workflowContext.headers, void 0, workflowContext.failureUrl, retries);
    await debug?.log("SUBMIT", "SUBMIT_FIRST_INVOCATION", {
        headers,
        requestPayload: workflowContext.requestPayload,
        url: workflowContext.url
    });
    try {
        await workflowContext.qstashClient.publishJSON({
            headers,
            method: "POST",
            body: workflowContext.requestPayload,
            url: workflowContext.url
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("success");
    } catch (error) {
        const error_ = error;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(error_);
    }
};
var triggerRouteFunction = async ({ onCleanup, onStep })=>{
    try {
        await onStep();
        await onCleanup();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("workflow-finished");
    } catch (error) {
        const error_ = error;
        return error_ instanceof QStashWorkflowAbort ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("step-finished") : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(error_);
    }
};
var triggerWorkflowDelete = async (workflowContext, debug, cancel = false)=>{
    await debug?.log("SUBMIT", "SUBMIT_CLEANUP", {
        deletedWorkflowRunId: workflowContext.workflowRunId
    });
    const result = await workflowContext.qstashClient.http.request({
        path: [
            "v2",
            "workflows",
            "runs",
            `${workflowContext.workflowRunId}?cancel=${cancel}`
        ],
        method: "DELETE",
        parseResponseAsJson: false
    });
    await debug?.log("SUBMIT", "SUBMIT_CLEANUP", result);
};
var recreateUserHeaders = (headers)=>{
    const filteredHeaders = new Headers();
    const pairs = headers.entries();
    for (const [header, value] of pairs){
        const headerLowerCase = header.toLowerCase();
        if (!headerLowerCase.startsWith("upstash-workflow-") && !headerLowerCase.startsWith("x-vercel-") && !headerLowerCase.startsWith("x-forwarded-") && headerLowerCase !== "cf-connecting-ip") {
            filteredHeaders.append(header, value);
        }
    }
    return filteredHeaders;
};
var handleThirdPartyCallResult = async (request, requestPayload, client, workflowUrl, failureUrl, retries, debug)=>{
    try {
        if (request.headers.get("Upstash-Workflow-Callback")) {
            const callbackMessage = JSON.parse(requestPayload);
            if (!(callbackMessage.status >= 200 && callbackMessage.status < 300)) {
                await debug?.log("WARN", "SUBMIT_THIRD_PARTY_RESULT", {
                    status: callbackMessage.status,
                    body: atob(callbackMessage.body)
                });
                console.warn(`Workflow Warning: "context.call" failed with status ${callbackMessage.status} and will retry (if there are retries remaining). Error Message:
${atob(callbackMessage.body)}`);
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("call-will-retry");
            }
            const workflowRunId = request.headers.get(WORKFLOW_ID_HEADER);
            const stepIdString = request.headers.get("Upstash-Workflow-StepId");
            const stepName = request.headers.get("Upstash-Workflow-StepName");
            const stepType = request.headers.get("Upstash-Workflow-StepType");
            const concurrentString = request.headers.get("Upstash-Workflow-Concurrent");
            const contentType = request.headers.get("Upstash-Workflow-ContentType");
            if (!(workflowRunId && stepIdString && stepName && StepTypes.includes(stepType) && concurrentString && contentType)) {
                throw new Error(`Missing info in callback message source header: ${JSON.stringify({
                    workflowRunId,
                    stepIdString,
                    stepName,
                    stepType,
                    concurrentString,
                    contentType
                })}`);
            }
            const userHeaders = recreateUserHeaders(request.headers);
            const requestHeaders = getHeaders("false", workflowRunId, workflowUrl, userHeaders, void 0, failureUrl, retries);
            const callResultStep = {
                stepId: Number(stepIdString),
                stepName,
                stepType,
                out: atob(callbackMessage.body),
                concurrent: Number(concurrentString)
            };
            await debug?.log("SUBMIT", "SUBMIT_THIRD_PARTY_RESULT", {
                step: callResultStep,
                headers: requestHeaders,
                url: workflowUrl
            });
            const result = await client.publishJSON({
                headers: requestHeaders,
                method: "POST",
                body: callResultStep,
                url: workflowUrl
            });
            await debug?.log("SUBMIT", "SUBMIT_THIRD_PARTY_RESULT", {
                messageId: result.messageId
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("is-call-return");
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("continue-workflow");
        }
    } catch (error) {
        const isCallReturn = request.headers.get("Upstash-Workflow-Callback");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(new QStashWorkflowError(`Error when handling call return (isCallReturn=${isCallReturn}): ${error}`));
    }
};
var getHeaders = (initHeaderValue, workflowRunId, workflowUrl, userHeaders, step, failureUrl, retries)=>{
    const baseHeaders = {
        [WORKFLOW_INIT_HEADER]: initHeaderValue,
        [WORKFLOW_ID_HEADER]: workflowRunId,
        [WORKFLOW_URL_HEADER]: workflowUrl,
        [`Upstash-Forward-${WORKFLOW_PROTOCOL_VERSION_HEADER}`]: WORKFLOW_PROTOCOL_VERSION,
        ...failureUrl ? {
            [`Upstash-Failure-Callback-Forward-${WORKFLOW_FAILURE_HEADER}`]: "true",
            "Upstash-Failure-Callback": failureUrl
        } : {},
        ...retries === void 0 ? {} : {
            "Upstash-Retries": retries.toString()
        }
    };
    if (userHeaders) {
        for (const header of userHeaders.keys()){
            if (step?.callHeaders) {
                baseHeaders[`Upstash-Callback-Forward-${header}`] = userHeaders.get(header);
            } else {
                baseHeaders[`Upstash-Forward-${header}`] = userHeaders.get(header);
            }
        }
    }
    if (step?.callHeaders) {
        const forwardedHeaders = Object.fromEntries(Object.entries(step.callHeaders).map(([header, value])=>[
                `Upstash-Forward-${header}`,
                value
            ]));
        const contentType = step.callHeaders["Content-Type"];
        return {
            ...baseHeaders,
            ...forwardedHeaders,
            "Upstash-Callback": workflowUrl,
            "Upstash-Callback-Workflow-RunId": workflowRunId,
            "Upstash-Callback-Workflow-CallType": "fromCallback",
            "Upstash-Callback-Workflow-Init": "false",
            "Upstash-Callback-Workflow-Url": workflowUrl,
            "Upstash-Callback-Forward-Upstash-Workflow-Callback": "true",
            "Upstash-Callback-Forward-Upstash-Workflow-StepId": step.stepId.toString(),
            "Upstash-Callback-Forward-Upstash-Workflow-StepName": step.stepName,
            "Upstash-Callback-Forward-Upstash-Workflow-StepType": step.stepType,
            "Upstash-Callback-Forward-Upstash-Workflow-Concurrent": step.concurrent.toString(),
            "Upstash-Callback-Forward-Upstash-Workflow-ContentType": contentType ?? DEFAULT_CONTENT_TYPE,
            "Upstash-Workflow-CallType": "toCallback"
        };
    }
    return baseHeaders;
};
var verifyRequest = async (body, signature, verifier)=>{
    if (!verifier) {
        return;
    }
    try {
        if (!signature) {
            throw new Error("`Upstash-Signature` header is not passed.");
        }
        const isValid = await verifier.verify({
            body,
            signature
        });
        if (!isValid) {
            throw new Error("Signature in `Upstash-Signature` header is not valid");
        }
    } catch (error) {
        throw new QStashWorkflowError(`Failed to verify that the Workflow request comes from QStash: ${error}

If signature is missing, trigger the workflow endpoint by publishing your request to QStash instead of calling it directly.

If you want to disable QStash Verification, you should clear env variables QSTASH_CURRENT_SIGNING_KEY and QSTASH_NEXT_SIGNING_KEY`);
    }
};
// src/client/workflow/auto-executor.ts
var AutoExecutor = class _AutoExecutor {
    context;
    promises = /* @__PURE__ */ new WeakMap();
    activeLazyStepList;
    debug;
    nonPlanStepCount;
    steps;
    indexInCurrentList = 0;
    stepCount = 0;
    planStepCount = 0;
    executingStep = false;
    constructor(context, steps, debug){
        this.context = context;
        this.debug = debug;
        this.steps = steps;
        this.nonPlanStepCount = this.steps.filter((step)=>!step.targetStep).length;
    }
    /**
   * Adds the step function to the list of step functions to run in
   * parallel. After adding the function, defers the execution, so
   * that if there is another step function to be added, it's also
   * added.
   *
   * After all functions are added, list of functions are executed.
   * If there is a single function, it's executed by itself. If there
   * are multiple, they are run in parallel.
   *
   * If a function is already executing (this.executingStep), this
   * means that there is a nested step which is not allowed. In this
   * case, addStep throws QStashWorkflowError.
   *
   * @param stepInfo step plan to add
   * @returns result of the step function
   */ async addStep(stepInfo) {
        if (this.executingStep) {
            throw new QStashWorkflowError(`A step can not be run inside another step. Tried to run '${stepInfo.stepName}' inside '${this.executingStep}'`);
        }
        this.stepCount += 1;
        const lazyStepList = this.activeLazyStepList ?? [];
        if (!this.activeLazyStepList) {
            this.activeLazyStepList = lazyStepList;
            this.indexInCurrentList = 0;
        }
        lazyStepList.push(stepInfo);
        const index = this.indexInCurrentList++;
        const requestComplete = this.deferExecution().then(async ()=>{
            if (!this.promises.has(lazyStepList)) {
                const promise2 = this.getExecutionPromise(lazyStepList);
                this.promises.set(lazyStepList, promise2);
                this.activeLazyStepList = void 0;
                this.planStepCount += lazyStepList.length > 1 ? lazyStepList.length : 0;
            }
            const promise = this.promises.get(lazyStepList);
            return promise;
        });
        const result = await requestComplete;
        return _AutoExecutor.getResult(lazyStepList, result, index);
    }
    /**
   * Wraps a step function to set this.executingStep to step name
   * before running and set this.executingStep to False after execution
   * ends.
   *
   * this.executingStep allows us to detect nested steps which are not
   * allowed.
   *
   * @param stepName name of the step being wrapped
   * @param stepFunction step function to wrap
   * @returns wrapped step function
   */ wrapStep(stepName, stepFunction) {
        this.executingStep = stepName;
        const result = stepFunction();
        this.executingStep = false;
        return result;
    }
    /**
   * Executes a step:
   * - If the step result is available in the steps, returns the result
   * - If the result is not avaiable, runs the function
   * - Sends the result to QStash
   *
   * @param lazyStep lazy step to execute
   * @returns step result
   */ async runSingle(lazyStep) {
        if (this.stepCount < this.nonPlanStepCount) {
            const step = this.steps[this.stepCount + this.planStepCount];
            validateStep(lazyStep, step);
            await this.debug?.log("INFO", "RUN_SINGLE", {
                fromRequest: true,
                step,
                stepCount: this.stepCount
            });
            return step.out;
        }
        const resultStep = await lazyStep.getResultStep(NO_CONCURRENCY, this.stepCount);
        await this.debug?.log("INFO", "RUN_SINGLE", {
            fromRequest: false,
            step: resultStep,
            stepCount: this.stepCount
        });
        await this.submitStepsToQStash([
            resultStep
        ]);
        return resultStep.out;
    }
    /**
   * Runs steps in parallel.
   *
   * @param stepName parallel step name
   * @param stepFunctions list of async functions to run in parallel
   * @returns results of the functions run in parallel
   */ async runParallel(parallelSteps) {
        const initialStepCount = this.stepCount - (parallelSteps.length - 1);
        const parallelCallState = this.getParallelCallState(parallelSteps.length, initialStepCount);
        const sortedSteps = sortSteps(this.steps);
        const plannedParallelStepCount = sortedSteps[initialStepCount + this.planStepCount]?.concurrent;
        if (parallelCallState !== "first" && plannedParallelStepCount !== parallelSteps.length) {
            throw new QStashWorkflowError(`Incompatible number of parallel steps when call state was '${parallelCallState}'. Expected ${parallelSteps.length}, got ${plannedParallelStepCount} from the request.`);
        }
        await this.debug?.log("INFO", "RUN_PARALLEL", {
            parallelCallState,
            initialStepCount,
            plannedParallelStepCount,
            stepCount: this.stepCount,
            planStepCount: this.planStepCount
        });
        switch(parallelCallState){
            case "first":
                {
                    const planSteps = parallelSteps.map((parallelStep, index)=>parallelStep.getPlanStep(parallelSteps.length, initialStepCount + index));
                    await this.submitStepsToQStash(planSteps);
                    break;
                }
            case "partial":
                {
                    const planStep = this.steps.at(-1);
                    if (!planStep || planStep.targetStep === void 0) {
                        throw new QStashWorkflowError(`There must be a last step and it should have targetStep larger than 0.Received: ${JSON.stringify(planStep)}`);
                    }
                    const stepIndex = planStep.targetStep - initialStepCount;
                    validateStep(parallelSteps[stepIndex], planStep);
                    try {
                        const resultStep = await parallelSteps[stepIndex].getResultStep(parallelSteps.length, planStep.targetStep);
                        await this.submitStepsToQStash([
                            resultStep
                        ]);
                    } catch (error) {
                        if (error instanceof QStashWorkflowAbort) {
                            throw error;
                        }
                        throw new QStashWorkflowError(`Error submitting steps to QStash in partial parallel step execution: ${error}`);
                    }
                    break;
                }
            case "discard":
                {
                    throw new QStashWorkflowAbort("discarded parallel");
                }
            case "last":
                {
                    const parallelResultSteps = sortedSteps.filter((step)=>step.stepId >= initialStepCount).slice(0, parallelSteps.length);
                    validateParallelSteps(parallelSteps, parallelResultSteps);
                    return parallelResultSteps.map((step)=>step.out);
                }
        }
        const fillValue = void 0;
        return Array.from({
            length: parallelSteps.length
        }).fill(fillValue);
    }
    /**
   * Determines the parallel call state
   *
   * First filters the steps to get the steps which are after `initialStepCount` parameter.
   *
   * Depending on the remaining steps, decides the parallel state:
   * - "first": If there are no steps
   * - "last" If there are equal to or more than `2 * parallelStepCount`. We multiply by two
   *   because each step in a parallel execution will have 2 steps: a plan step and a result
   *   step.
   * - "partial": If the last step is a plan step
   * - "discard": If the last step is not a plan step. This means that the parallel execution
   *   is in progress (there are still steps to run) and one step has finished and submitted
   *   its result to QStash
   *
   * @param parallelStepCount number of steps to run in parallel
   * @param initialStepCount steps after the parallel invocation
   * @returns parallel call state
   */ getParallelCallState(parallelStepCount, initialStepCount) {
        const remainingSteps = this.steps.filter((step)=>(step.targetStep ?? step.stepId) >= initialStepCount);
        if (remainingSteps.length === 0) {
            return "first";
        } else if (remainingSteps.length >= 2 * parallelStepCount) {
            return "last";
        } else if (remainingSteps.at(-1)?.targetStep) {
            return "partial";
        } else {
            return "discard";
        }
    }
    /**
   * sends the steps to QStash as batch
   *
   * @param steps steps to send
   */ async submitStepsToQStash(steps) {
        if (steps.length === 0) {
            throw new QStashWorkflowError(`Unable to submit steps to QStash. Provided list is empty. Current step: ${this.stepCount}`);
        }
        await this.debug?.log("SUBMIT", "SUBMIT_STEP", {
            length: steps.length,
            steps
        });
        const result = await this.context.qstashClient.batchJSON(steps.map((singleStep)=>{
            const headers = getHeaders("false", this.context.workflowRunId, this.context.url, this.context.headers, singleStep, this.context.failureUrl, this.context.retries);
            const willWait = singleStep.concurrent === NO_CONCURRENCY || singleStep.stepId === 0;
            return singleStep.callUrl ? // if the step is a third party call, we call the third party
            // url (singleStep.callUrl) and pass information about the workflow
            // in the headers (handled in getHeaders). QStash makes the request
            // to callUrl and returns the result to Workflow endpoint.
            // handleThirdPartyCallResult method sends the result of the third
            // party call to QStash.
            {
                headers,
                method: singleStep.callMethod,
                body: singleStep.callBody,
                url: singleStep.callUrl
            } : // if the step is not a third party call, we use workflow
            // endpoint (context.url) as URL when calling QStash. QStash
            // calls us back with the updated steps list.
            {
                headers,
                method: "POST",
                body: singleStep,
                url: this.context.url,
                notBefore: willWait ? singleStep.sleepUntil : void 0,
                delay: willWait ? singleStep.sleepFor : void 0
            };
        }));
        await this.debug?.log("INFO", "SUBMIT_STEP", {
            messageIds: result.map((message)=>{
                return {
                    message: message.messageId
                };
            })
        });
        throw new QStashWorkflowAbort(steps[0].stepName, steps[0]);
    }
    /**
   * Get the promise by executing the lazt steps list. If there is a single
   * step, we call `runSingle`. Otherwise `runParallel` is called.
   *
   * @param lazyStepList steps list to execute
   * @returns promise corresponding to the execution
   */ getExecutionPromise(lazyStepList) {
        return lazyStepList.length === 1 ? this.runSingle(lazyStepList[0]) : this.runParallel(lazyStepList);
    }
    /**
   * @param lazyStepList steps we executed
   * @param result result of the promise from `getExecutionPromise`
   * @param index index of the current step
   * @returns result[index] if lazyStepList > 1, otherwise result
   */ // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    static getResult(lazyStepList, result, index) {
        if (lazyStepList.length === 1) {
            return result;
        } else if (Array.isArray(result) && lazyStepList.length === result.length && index < lazyStepList.length) {
            return result[index];
        } else {
            throw new QStashWorkflowError(`Unexpected parallel call result while executing step ${index}: '${result}'. Expected ${lazyStepList.length} many items`);
        }
    }
    async deferExecution() {
        await Promise.resolve();
        await Promise.resolve();
    }
};
var validateStep = (lazyStep, stepFromRequest)=>{
    if (lazyStep.stepName !== stepFromRequest.stepName) {
        throw new QStashWorkflowError(`Incompatible step name. Expected '${lazyStep.stepName}', got '${stepFromRequest.stepName}' from the request`);
    }
    if (lazyStep.stepType !== stepFromRequest.stepType) {
        throw new QStashWorkflowError(`Incompatible step type. Expected '${lazyStep.stepType}', got '${stepFromRequest.stepType}' from the request`);
    }
};
var validateParallelSteps = (lazySteps, stepsFromRequest)=>{
    try {
        for (const [index, stepFromRequest] of stepsFromRequest.entries()){
            validateStep(lazySteps[index], stepFromRequest);
        }
    } catch (error) {
        if (error instanceof QStashWorkflowError) {
            const lazyStepNames = lazySteps.map((lazyStep)=>lazyStep.stepName);
            const lazyStepTypes = lazySteps.map((lazyStep)=>lazyStep.stepType);
            const requestStepNames = stepsFromRequest.map((step)=>step.stepName);
            const requestStepTypes = stepsFromRequest.map((step)=>step.stepType);
            throw new QStashWorkflowError(`Incompatible steps detected in parallel execution: ${error.message}
  > Step Names from the request: ${JSON.stringify(requestStepNames)}
    Step Types from the request: ${JSON.stringify(requestStepTypes)}
  > Step Names expected: ${JSON.stringify(lazyStepNames)}
    Step Types expected: ${JSON.stringify(lazyStepTypes)}`);
        }
        throw error;
    }
};
var sortSteps = (steps)=>{
    const getStepId = (step)=>step.targetStep ?? step.stepId;
    return [
        ...steps
    ].sort((step, stepOther)=>getStepId(step) - getStepId(stepOther));
};
// src/client/workflow/steps.ts
var BaseLazyStep = class {
    stepName;
    // will be set in the subclasses
    constructor(stepName){
        this.stepName = stepName;
    }
};
var LazyFunctionStep = class extends BaseLazyStep {
    stepFunction;
    stepType = "Run";
    constructor(stepName, stepFunction){
        super(stepName);
        this.stepFunction = stepFunction;
    }
    getPlanStep(concurrent, targetStep) {
        {
            return {
                stepId: 0,
                stepName: this.stepName,
                stepType: this.stepType,
                concurrent,
                targetStep
            };
        }
    }
    async getResultStep(concurrent, stepId) {
        let result = this.stepFunction();
        if (result instanceof Promise) {
            result = await result;
        }
        return {
            stepId,
            stepName: this.stepName,
            stepType: this.stepType,
            out: result,
            concurrent
        };
    }
};
var LazySleepStep = class extends BaseLazyStep {
    sleep;
    stepType = "SleepFor";
    constructor(stepName, sleep){
        super(stepName);
        this.sleep = sleep;
    }
    getPlanStep(concurrent, targetStep) {
        {
            return {
                stepId: 0,
                stepName: this.stepName,
                stepType: this.stepType,
                sleepFor: this.sleep,
                concurrent,
                targetStep
            };
        }
    }
    async getResultStep(concurrent, stepId) {
        return await Promise.resolve({
            stepId,
            stepName: this.stepName,
            stepType: this.stepType,
            sleepFor: this.sleep,
            concurrent
        });
    }
};
var LazySleepUntilStep = class extends BaseLazyStep {
    sleepUntil;
    stepType = "SleepUntil";
    constructor(stepName, sleepUntil){
        super(stepName);
        this.sleepUntil = sleepUntil;
    }
    getPlanStep(concurrent, targetStep) {
        {
            return {
                stepId: 0,
                stepName: this.stepName,
                stepType: this.stepType,
                sleepUntil: this.sleepUntil,
                concurrent,
                targetStep
            };
        }
    }
    async getResultStep(concurrent, stepId) {
        return await Promise.resolve({
            stepId,
            stepName: this.stepName,
            stepType: this.stepType,
            sleepUntil: this.sleepUntil,
            concurrent
        });
    }
};
var LazyCallStep = class extends BaseLazyStep {
    url;
    method;
    body;
    headers;
    stepType = "Call";
    constructor(stepName, url, method, body, headers){
        super(stepName);
        this.url = url;
        this.method = method;
        this.body = body;
        this.headers = headers;
    }
    getPlanStep(concurrent, targetStep) {
        {
            return {
                stepId: 0,
                stepName: this.stepName,
                stepType: this.stepType,
                concurrent,
                targetStep
            };
        }
    }
    async getResultStep(concurrent, stepId) {
        return await Promise.resolve({
            stepId,
            stepName: this.stepName,
            stepType: this.stepType,
            concurrent,
            callUrl: this.url,
            callMethod: this.method,
            callBody: this.body,
            callHeaders: this.headers
        });
    }
};
// src/client/workflow/context.ts
var WorkflowContext = class {
    executor;
    steps;
    /**
   * QStash client of the workflow
   *
   * Can be overwritten by passing `qstashClient` parameter in `serve`:
   *
   * ```ts
   * import { Client } from "@upstash/qstash"
   *
   * export const POST = serve(
   *   async (context) => {
   *     ...
   *   },
   *   {
   *     qstashClient: new Client({...})
   *   }
   * )
   * ```
   */ qstashClient;
    /**
   * Run id of the workflow
   */ workflowRunId;
    /**
   * URL of the workflow
   *
   * Can be overwritten by passing a `url` parameter in `serve`:
   *
   * ```ts
   * export const POST = serve(
   *   async (context) => {
   *     ...
   *   },
   *   {
   *     url: "new-url-value"
   *   }
   * )
   * ```
   */ url;
    /**
   * URL to call in case of workflow failure with QStash failure callback
   *
   * https://upstash.com/docs/qstash/features/callbacks#what-is-a-failure-callback
   *
   * Can be overwritten by passing a `failureUrl` parameter in `serve`:
   *
   * ```ts
   * export const POST = serve(
   *   async (context) => {
   *     ...
   *   },
   *   {
   *     failureUrl: "new-url-value"
   *   }
   * )
   * ```
   */ failureUrl;
    /**
   * Payload of the request which started the workflow.
   *
   * To specify its type, you can define `serve` as follows:
   *
   * ```ts
   * // set requestPayload type to MyPayload:
   * export const POST = serve<MyPayload>(
   *   async (context) => {
   *     ...
   *   }
   * )
   * ```
   *
   * By default, `serve` tries to apply `JSON.parse` to the request payload.
   * If your payload is encoded in a format other than JSON, you can utilize
   * the `initialPayloadParser` parameter:
   *
   * ```ts
   * export const POST = serve<MyPayload>(
   *   async (context) => {
   *     ...
   *   },
   *   {
   *     initialPayloadParser: (initialPayload) => {return doSomething(initialPayload)}
   *   }
   * )
   * ```
   */ requestPayload;
    /**
   * headers of the initial request
   */ headers;
    /**
   * initial payload as a raw string
   */ rawInitialPayload;
    /**
   * Map of environment variables and their values.
   *
   * Can be set using the `env` option of serve:
   *
   * ```ts
   * export const POST = serve<MyPayload>(
   *   async (context) => {
   *     const key = context.env["API_KEY"];
   *   },
   *   {
   *     env: {
   *       "API_KEY": "*****";
   *     }
   *   }
   * )
   * ```
   *
   * Default value is set to `process.env`.
   */ env;
    /**
   * Number of retries
   */ retries;
    constructor({ qstashClient, workflowRunId, headers, steps, url, failureUrl, debug, initialPayload, rawInitialPayload, env, retries }){
        this.qstashClient = qstashClient;
        this.workflowRunId = workflowRunId;
        this.steps = steps;
        this.url = url;
        this.failureUrl = failureUrl;
        this.headers = headers;
        this.requestPayload = initialPayload;
        this.rawInitialPayload = rawInitialPayload ?? JSON.stringify(this.requestPayload);
        this.env = env ?? {};
        this.retries = retries ?? DEFAULT_RETRIES;
        this.executor = new AutoExecutor(this, this.steps, debug);
    }
    /**
   * Executes a workflow step
   *
   * ```typescript
   * const result = await context.run("step 1", () => {
   *   return "result"
   * })
   * ```
   *
   * Can also be called in parallel and the steps will be executed
   * simulatenously:
   *
   * ```typescript
   * const [result1, result2] = await Promise.all([
   *   context.run("step 1", () => {
   *     return "result1"
   *   })
   *   context.run("step 2", async () => {
   *     return await fetchResults()
   *   })
   * ])
   * ```
   *
   * @param stepName name of the step
   * @param stepFunction step function to be executed
   * @returns result of the step function
   */ async run(stepName, stepFunction) {
        const wrappedStepFunction = ()=>this.executor.wrapStep(stepName, stepFunction);
        return this.addStep(new LazyFunctionStep(stepName, wrappedStepFunction));
    }
    /**
   * Stops the execution for the duration provided.
   *
   * @param stepName
   * @param duration sleep duration in seconds
   * @returns undefined
   */ async sleep(stepName, duration) {
        await this.addStep(new LazySleepStep(stepName, duration));
    }
    /**
   * Stops the execution until the date time provided.
   *
   * @param stepName
   * @param datetime time to sleep until. Can be provided as a number (in unix seconds),
   *   as a Date object or a string (passed to `new Date(datetimeString)`)
   * @returns undefined
   */ async sleepUntil(stepName, datetime) {
        let time;
        if (typeof datetime === "number") {
            time = datetime;
        } else {
            datetime = typeof datetime === "string" ? new Date(datetime) : datetime;
            time = Math.round(datetime.getTime() / 1e3);
        }
        await this.addStep(new LazySleepUntilStep(stepName, time));
    }
    /**
   * Makes a third party call through QStash in order to make a
   * network call without consuming any runtime.
   *
   * ```ts
   * const postResult = await context.call<string>(
   *   "post call step",
   *   `https://www.some-endpoint.com/api`,
   *   "POST",
   *   "my-payload"
   * );
   * ```
   *
   * tries to parse the result of the request as JSON. If it's
   * not a JSON which can be parsed, simply returns the response
   * body as it is.
   *
   * @param stepName
   * @param url url to call
   * @param method call method
   * @param body call body
   * @param headers call headers
   * @returns call result (parsed as JSON if possible)
   */ // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    async call(stepName, url, method, body, headers) {
        const result = await this.addStep(new LazyCallStep(stepName, url, method, body, headers ?? {}));
        try {
            return JSON.parse(result);
        } catch  {
            return result;
        }
    }
    /**
   * Adds steps to the executor. Needed so that it can be overwritten in
   * DisabledWorkflowContext.
   */ async addStep(step) {
        return await this.executor.addStep(step);
    }
};
var DisabledWorkflowContext = class _DisabledWorkflowContext extends WorkflowContext {
    static disabledMessage = "disabled-qstash-worklfow-run";
    /**
   * overwrite the WorkflowContext.addStep method to always raise QStashWorkflowAbort
   * error in order to stop the execution whenever we encounter a step.
   *
   * @param _step
   */ // eslint-disable-next-line @typescript-eslint/require-await
    async addStep(_step) {
        throw new QStashWorkflowAbort(_DisabledWorkflowContext.disabledMessage);
    }
    /**
   * copies the passed context to create a DisabledWorkflowContext. Then, runs the
   * route function with the new context.
   *
   * - returns "run-ended" if there are no steps found or
   *      if the auth failed and user called `return`
   * - returns "step-found" if DisabledWorkflowContext.addStep is called.
   * - if there is another error, returns the error.
   *
   * @param routeFunction
   */ static async tryAuthentication(routeFunction, context) {
        const disabledContext = new _DisabledWorkflowContext({
            qstashClient: new Client({
                baseUrl: "disabled-client",
                token: "disabled-client"
            }),
            workflowRunId: context.workflowRunId,
            headers: context.headers,
            steps: [],
            url: context.url,
            failureUrl: context.failureUrl,
            initialPayload: context.requestPayload,
            rawInitialPayload: context.rawInitialPayload,
            env: context.env,
            retries: context.retries
        });
        try {
            await routeFunction(disabledContext);
        } catch (error) {
            if (error instanceof QStashWorkflowAbort && error.stepName === this.disabledMessage) {
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("step-found");
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(error);
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("run-ended");
    }
};
// src/client/workflow/logger.ts
var LOG_LEVELS = [
    "DEBUG",
    "INFO",
    "SUBMIT",
    "WARN",
    "ERROR"
];
var WorkflowLogger = class _WorkflowLogger {
    logs = [];
    options;
    workflowRunId = void 0;
    constructor(options){
        this.options = options;
    }
    async log(level, eventType, details) {
        if (this.shouldLog(level)) {
            const timestamp = Date.now();
            const logEntry = {
                timestamp,
                workflowRunId: this.workflowRunId ?? "",
                logLevel: level,
                eventType,
                details
            };
            this.logs.push(logEntry);
            if (this.options.logOutput === "console") {
                this.writeToConsole(logEntry);
            }
            await new Promise((resolve)=>setTimeout(resolve, 100));
        }
    }
    setWorkflowRunId(workflowRunId) {
        this.workflowRunId = workflowRunId;
    }
    writeToConsole(logEntry) {
        const JSON_SPACING = 2;
        console.log(JSON.stringify(logEntry, void 0, JSON_SPACING));
    }
    shouldLog(level) {
        return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.options.logLevel);
    }
    static getLogger(verbose) {
        if (typeof verbose === "object") {
            return verbose;
        } else {
            return verbose ? new _WorkflowLogger({
                logLevel: "INFO",
                logOutput: "console"
            }) : void 0;
        }
    }
};
;
var getPayload = async (request)=>{
    try {
        return await request.text();
    } catch  {
        return;
    }
};
var parsePayload = (rawPayload)=>{
    const [encodedInitialPayload, ...encodedSteps] = JSON.parse(rawPayload);
    const rawInitialPayload = decodeBase64(encodedInitialPayload.body);
    const initialStep = {
        stepId: 0,
        stepName: "init",
        stepType: "Initial",
        out: rawInitialPayload,
        concurrent: NO_CONCURRENCY
    };
    const stepsToDecode = encodedSteps.filter((step)=>step.callType === "step");
    const otherSteps = stepsToDecode.map((rawStep)=>{
        return JSON.parse(decodeBase64(rawStep.body));
    });
    const steps = [
        initialStep,
        ...otherSteps
    ];
    return {
        rawInitialPayload,
        steps
    };
};
var deduplicateSteps = (steps)=>{
    const targetStepIds = [];
    const stepIds = [];
    const deduplicatedSteps = [];
    for (const step of steps){
        if (step.stepId === 0) {
            if (!targetStepIds.includes(step.targetStep ?? 0)) {
                deduplicatedSteps.push(step);
                targetStepIds.push(step.targetStep ?? 0);
            }
        } else {
            if (!stepIds.includes(step.stepId)) {
                deduplicatedSteps.push(step);
                stepIds.push(step.stepId);
            }
        }
    }
    return deduplicatedSteps;
};
var checkIfLastOneIsDuplicate = async (steps, debug)=>{
    if (steps.length < 2) {
        return false;
    }
    const lastStep = steps.at(-1);
    const lastStepId = lastStep.stepId;
    const lastTargetStepId = lastStep.targetStep;
    for(let index = 0; index < steps.length - 1; index++){
        const step = steps[index];
        if (step.stepId === lastStepId && step.targetStep === lastTargetStepId) {
            const message = `Upstash Workflow: The step '${step.stepName}' with id '${step.stepId}'  has run twice during workflow execution. Rest of the workflow will continue running as usual.`;
            await debug?.log("WARN", "RESPONSE_DEFAULT", message);
            console.warn(message);
            return true;
        }
    }
    return false;
};
var validateRequest = (request)=>{
    const versionHeader = request.headers.get(WORKFLOW_PROTOCOL_VERSION_HEADER);
    const isFirstInvocation = !versionHeader;
    if (!isFirstInvocation && versionHeader !== WORKFLOW_PROTOCOL_VERSION) {
        throw new QStashWorkflowError(`Incompatible workflow sdk protocol version. Expected ${WORKFLOW_PROTOCOL_VERSION}, got ${versionHeader} from the request.`);
    }
    const workflowRunId = isFirstInvocation ? `wfr_${nanoid()}` : request.headers.get(WORKFLOW_ID_HEADER) ?? "";
    if (workflowRunId.length === 0) {
        throw new QStashWorkflowError("Couldn't get workflow id from header");
    }
    return {
        isFirstInvocation,
        workflowRunId
    };
};
var parseRequest = async (requestPayload, isFirstInvocation, debug)=>{
    if (isFirstInvocation) {
        return {
            rawInitialPayload: requestPayload ?? "",
            steps: [],
            isLastDuplicate: false
        };
    } else {
        if (!requestPayload) {
            throw new QStashWorkflowError("Only first call can have an empty body");
        }
        const { rawInitialPayload, steps } = parsePayload(requestPayload);
        const isLastDuplicate = await checkIfLastOneIsDuplicate(steps, debug);
        const deduplicatedSteps = deduplicateSteps(steps);
        return {
            rawInitialPayload,
            steps: deduplicatedSteps,
            isLastDuplicate
        };
    }
};
var handleFailure = async (request, requestPayload, qstashClient, initialPayloadParser, failureFunction, debug)=>{
    if (request.headers.get(WORKFLOW_FAILURE_HEADER) !== "true") {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("not-failure-callback");
    }
    if (!failureFunction) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(new QStashWorkflowError("Workflow endpoint is called to handle a failure, but a failureFunction is not provided in serve options. Either provide a failureUrl or a failureFunction."));
    }
    try {
        const { status, header, body, url, sourceHeader, sourceBody, workflowRunId } = JSON.parse(requestPayload);
        const decodedBody = body ? decodeBase64(body) : "{}";
        const errorPayload = JSON.parse(decodedBody);
        const { rawInitialPayload, steps, isLastDuplicate: _isLastDuplicate } = await parseRequest(decodeBase64(sourceBody), false, debug);
        const workflowContext = new WorkflowContext({
            qstashClient,
            workflowRunId,
            initialPayload: initialPayloadParser(rawInitialPayload),
            rawInitialPayload,
            headers: recreateUserHeaders(new Headers(sourceHeader)),
            steps,
            url,
            failureUrl: url,
            debug
        });
        await failureFunction(workflowContext, status, errorPayload.message, header);
    } catch (error) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["err"])(error);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$neverthrow$40$7$2e$2$2e$0$2f$node_modules$2f$neverthrow$2f$dist$2f$index$2e$es$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ok"])("is-failure-callback");
};
// src/client/workflow/serve.ts
var processOptions = (options)=>{
    const environment = options?.env ?? (typeof process === "undefined" ? {} : process.env);
    const receiverEnvironmentVariablesSet = Boolean(environment.QSTASH_CURRENT_SIGNING_KEY && environment.QSTASH_NEXT_SIGNING_KEY);
    return {
        qstashClient: new Client({
            baseUrl: environment.QSTASH_URL,
            token: environment.QSTASH_TOKEN
        }),
        onStepFinish: (workflowRunId, _finishCondition)=>new Response(JSON.stringify({
                workflowRunId
            }), {
                status: 200
            }),
        initialPayloadParser: (initialRequest)=>{
            if (!initialRequest) {
                return void 0;
            }
            try {
                return JSON.parse(initialRequest);
            } catch (error) {
                if (error instanceof SyntaxError) {
                    return initialRequest;
                }
                throw error;
            }
        },
        receiver: receiverEnvironmentVariablesSet ? new Receiver({
            currentSigningKey: environment.QSTASH_CURRENT_SIGNING_KEY,
            nextSigningKey: environment.QSTASH_NEXT_SIGNING_KEY
        }) : void 0,
        baseUrl: environment.UPSTASH_WORKFLOW_URL,
        env: environment,
        retries: DEFAULT_RETRIES,
        ...options
    };
};
var serve = (routeFunction, options)=>{
    const { qstashClient, onStepFinish, initialPayloadParser, url, verbose, receiver, failureUrl, failureFunction, baseUrl, env, retries } = processOptions(options);
    const debug = WorkflowLogger.getLogger(verbose);
    const handler = async (request)=>{
        const initialWorkflowUrl = url ?? request.url;
        const workflowUrl = baseUrl ? initialWorkflowUrl.replace(/^(https?:\/\/[^/]+)(\/.*)?$/, (_, matchedBaseUrl, path)=>{
            return baseUrl + (path || "");
        }) : initialWorkflowUrl;
        if (workflowUrl !== initialWorkflowUrl) {
            await debug?.log("WARN", "ENDPOINT_START", {
                warning: `Upstash Workflow: replacing the base of the url with "${baseUrl}" and using it as workflow endpoint.`,
                originalURL: initialWorkflowUrl,
                updatedURL: workflowUrl
            });
        }
        const workflowFailureUrl = failureFunction ? workflowUrl : failureUrl;
        const requestPayload = await getPayload(request) ?? "";
        await verifyRequest(requestPayload, request.headers.get("upstash-signature"), receiver);
        await debug?.log("INFO", "ENDPOINT_START");
        const failureCheck = await handleFailure(request, requestPayload, qstashClient, initialPayloadParser, failureFunction);
        if (failureCheck.isErr()) {
            throw failureCheck.error;
        } else if (failureCheck.value === "is-failure-callback") {
            await debug?.log("WARN", "RESPONSE_DEFAULT", "failureFunction executed");
            return onStepFinish("no-workflow-id", "failure-callback");
        }
        const { isFirstInvocation, workflowRunId } = validateRequest(request);
        debug?.setWorkflowRunId(workflowRunId);
        const { rawInitialPayload, steps, isLastDuplicate } = await parseRequest(requestPayload, isFirstInvocation, debug);
        if (isLastDuplicate) {
            return onStepFinish("no-workflow-id", "duplicate-step");
        }
        const workflowContext = new WorkflowContext({
            qstashClient,
            workflowRunId,
            initialPayload: initialPayloadParser(rawInitialPayload),
            rawInitialPayload,
            headers: recreateUserHeaders(request.headers),
            steps,
            url: workflowUrl,
            failureUrl: workflowFailureUrl,
            debug,
            env
        });
        const authCheck = await DisabledWorkflowContext.tryAuthentication(routeFunction, workflowContext);
        if (authCheck.isErr()) {
            await debug?.log("ERROR", "ERROR", {
                error: authCheck.error.message
            });
            throw authCheck.error;
        } else if (authCheck.value === "run-ended") {
            return onStepFinish("no-workflow-id", "auth-fail");
        }
        const callReturnCheck = await handleThirdPartyCallResult(request, rawInitialPayload, qstashClient, workflowUrl, workflowFailureUrl, retries, debug);
        if (callReturnCheck.isErr()) {
            await debug?.log("ERROR", "SUBMIT_THIRD_PARTY_RESULT", {
                error: callReturnCheck.error.message
            });
            throw callReturnCheck.error;
        } else if (callReturnCheck.value === "continue-workflow") {
            const result = isFirstInvocation ? await triggerFirstInvocation(workflowContext, retries, debug) : await triggerRouteFunction({
                onStep: async ()=>routeFunction(workflowContext),
                onCleanup: async ()=>{
                    await triggerWorkflowDelete(workflowContext, debug);
                }
            });
            if (result.isErr()) {
                await debug?.log("ERROR", "ERROR", {
                    error: result.error.message
                });
                throw result.error;
            }
            await debug?.log("INFO", "RESPONSE_WORKFLOW");
            return onStepFinish(workflowContext.workflowRunId, "success");
        }
        await debug?.log("INFO", "RESPONSE_DEFAULT");
        return onStepFinish("no-workflow-id", "fromCallback");
    };
    return async (request)=>{
        try {
            return await handler(request);
        } catch (error) {
            console.error(error);
            return new Response(JSON.stringify(formatWorkflowError(error)), {
                status: 500
            });
        }
    };
};
// src/client/workflow/index.ts
var Workflow = class {
    http;
    constructor(http){
        this.http = http;
    }
    /**
   * Cancel an ongoing workflow
   *
   * @param workflowRunId run id of the workflow to delete
   * @returns true if workflow is succesfully deleted. Otherwise throws QStashError
   */ async cancel(workflowRunId) {
        const result = await this.http.request({
            path: [
                "v2",
                "workflows",
                "runs",
                `${workflowRunId}?cancel=true`
            ],
            method: "DELETE",
            parseResponseAsJson: false
        });
        return result ?? true;
    }
};
;
}}),
"[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-ODRYYMMA.mjs [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "resend": (()=>resend)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$chunk$2d$G7CVCBTL$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-G7CVCBTL.mjs [app-route] (ecmascript)");
;
// src/client/api/email.ts
var EmailProvider = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$chunk$2d$G7CVCBTL$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseProvider"] {
    apiKind = "email";
    batch;
    method = "POST";
    constructor(baseUrl, token, owner, batch){
        super(baseUrl, token, owner);
        this.batch = batch;
    }
    getRoute() {
        return this.batch ? [
            "emails",
            "batch"
        ] : [
            "emails"
        ];
    }
    getHeaders(_options) {
        return {
            authorization: `Bearer ${this.token}`
        };
    }
    onFinish(providerInfo, _options) {
        return providerInfo;
    }
};
var resend = ({ token, batch = false })=>{
    return new EmailProvider("https://api.resend.com", token, "resend", batch);
};
;
}}),
"[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/index.mjs [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$chunk$2d$ODRYYMMA$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-ODRYYMMA.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$chunk$2d$G7CVCBTL$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-G7CVCBTL.mjs [app-route] (ecmascript)");
;
;
;
}}),
"[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/index.mjs [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$chunk$2d$ODRYYMMA$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-ODRYYMMA.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$chunk$2d$G7CVCBTL$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/chunk-G7CVCBTL.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$upstash$2b$qstash$40$2$2e$7$2e$23$2f$node_modules$2f40$upstash$2f$qstash$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@upstash+qstash@2.7.23/node_modules/@upstash/qstash/index.mjs [app-route] (ecmascript) <locals>");
}}),

};

//# sourceMappingURL=182b1_%40upstash_qstash_0744a4e0._.js.map