import { NextResponse } from "next/server";

import { ApiError } from "./api-error";
import { FrontendErrorCode } from "./frontend-error-code";

export function successResponse<T>(
    data: T,
    message = "Thành công",
    status = 200,
) {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status },
    );
}

export function errorResponse(
    message: string,
    status: number,
    code: string,
) {
    return NextResponse.json(
        {
            success: false,
            code,
            message,
            data: null,
        },
        { status },
    );
}

export function handleRouteError(error: unknown) {
    if (error instanceof ApiError) {
        return errorResponse(
            error.message,
            error.status,
            error.code ?? FrontendErrorCode.INTERNAL_ERROR,
        );
    }

    console.error(error);

    return errorResponse(
        "Không thể kết nối đến máy chủ",
        500,
        FrontendErrorCode.INTERNAL_ERROR,
    );
}