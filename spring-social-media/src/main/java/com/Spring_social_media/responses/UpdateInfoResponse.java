package com.Spring_social_media.responses;

public class UpdateInfoResponse {
    private String error1;
    private String error2;

    public void setError1(String error) {
        this.error1 = error;
    }
    public String getError1() {
        return error1;
    }

    public void setError2(String error) {
        this.error2 = error;
    }
    public String getError2() {
        return error2;
    }

    public boolean isValid() {
        if (error1 == null && error2 == null) {
            return true;
        } else {
            return false;
        }
    }

}
