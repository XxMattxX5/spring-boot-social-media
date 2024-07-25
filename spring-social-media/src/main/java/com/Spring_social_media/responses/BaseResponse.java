package com.Spring_social_media.responses;

public class BaseResponse {

    private String message;
    private String error;

    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getMessage() {
        return message;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getError() {
        return error;
    }
    

}
