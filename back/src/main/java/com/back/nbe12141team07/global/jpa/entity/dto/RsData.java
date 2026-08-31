package com.back.nbe12141team07.global.jpa.entity.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class RsData<T> {

    private String resultCode;
    private String msg;
    //    private Object data; 이렇게 해도 되지만 나중에 꺼내 쓸 때 불편
    private T data; // 제너릭을 사용하면 RsData 를 사용하는 시점에 T를 결정할 수 있음

    public RsData(String resultCode, String msg) {
        this.resultCode = resultCode;
        this.msg = msg;
        this.data = null;
    }

    @JsonIgnore
    public int getStatusCode() {
        return Integer.parseInt(resultCode.split("-")[0]); // "201-1"
    }
}