package com.fedoubt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fedoubt.common.message.CustomHttpStatus;
import com.fedoubt.common.message.ResponseUtils;
import com.fedoubt.dtos.CryDto;
import com.fedoubt.services.CryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/v1/cry")
public class CryController {

    private final CryService cryService;

    public CryController(CryService cryService){
        this.cryService = cryService;
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/encrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> encrypt(@RequestBody byte[] data) {
        if (data == null || data.length == 0) {
            return ResponseEntity.badRequest().body(ResponseUtils.error("Request body is empty"));
        }

        try {
            CryDto request = objectMapper.readValue(data, CryDto.class);
            return ResponseEntity.ok(ResponseUtils.success(cryService.encrypt(request)));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseUtils.error("Invalid request format"));
        }
    }

    @PostMapping(value = "/decrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> decrypt(@RequestBody byte[] data) {
        if (data == null || data.length == 0) {
            return ResponseEntity.badRequest().body(ResponseUtils.error("Request body is empty"));
        }

        try{
            CryDto request = objectMapper.readValue(data, CryDto.class);
            String itemname = request.getItemname();
            return ResponseEntity.ok(ResponseUtils.success(cryService.decrypt(itemname)));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseUtils.error("Invalid request format"));
        }
    }
}