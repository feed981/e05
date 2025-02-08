package com.fedoubt.common.message;

public enum CustomHttpStatus implements ApiStatus {
    INVALID_REQUEST_DATA(400, "Invalid request data"),
    INTERNAL_SERVER_ERROR(500,  "Internal Server Error"),
    CONFLICT(409, "Conflict"),

    ;

    private final int value;
    private final String reasonPhrase;

    CustomHttpStatus(int value, String reasonPhrase) {
        this.value = value;
        this.reasonPhrase = reasonPhrase;
    }

    @Override
    public int value() {
        return value;
    }

    @Override
    public String getReasonPhrase() {
        return reasonPhrase;
    }
}
