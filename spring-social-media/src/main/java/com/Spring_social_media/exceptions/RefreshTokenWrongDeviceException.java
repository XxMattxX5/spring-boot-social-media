package com.Spring_social_media.exceptions;

public class RefreshTokenWrongDeviceException extends RuntimeException {
    public RefreshTokenWrongDeviceException(String message) {
        super(message);
    }
}
