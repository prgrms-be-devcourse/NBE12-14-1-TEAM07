package com.back.nbe12141team07.domain.orders.dto;

import java.util.List;

public record OrderModifyRequest(
        List<OrderDetailModifyRequest> details
) {
}
