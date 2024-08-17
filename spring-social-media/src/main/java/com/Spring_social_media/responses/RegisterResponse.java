package com.Spring_social_media.responses;

public class RegisterResponse {
    private String error1;
    private String error2;
    private String error3;
    private String error4;

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

    public void setError3(String error) {
        this.error3 = error;
    }

    public String getError3() {
        return error3;
    } 

    public void setError4(String error) {
        this.error4 = error;
    }

    public String getError4() {
        return error4;
    }

    public boolean isValid() {
        if (error1 == null && error2 == null && error3 == null && error4 == null) {
            return true;
        } else {
            return false;
        }
    }
}
