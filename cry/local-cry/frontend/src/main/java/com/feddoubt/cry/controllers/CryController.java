package com.feddoubt.cry.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.feddoubt.common.config.message.CustomHttpStatus;
import com.feddoubt.common.config.message.ResponseUtils;
import com.feddoubt.cry.services.CryService;
import com.feddoubt.cry.services.EncryptionService;
import com.feddoubt.model.dtos.CryDto;
import com.feddoubt.model.pojos.EncryptionRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/cry")
public class CryController {

    private final CryService cryService;

    private final EncryptionService encryptionService;

    public CryController(CryService cryService , EncryptionService encryptionService){
        this.cryService = cryService;
        this.encryptionService = encryptionService;
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/encrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> encrypt(@RequestBody byte[] data) {
        CryDto cryDto = requestData(data);
        if(cryDto == null){
            return ResponseUtils.httpStatus2ApiResponse(CustomHttpStatus.INVALID_REQUEST_DATA);
        }
        return ResponseEntity.ok(ResponseUtils.success(cryService.encrypt(cryDto)));
    }

    @PostMapping(value = "/decrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> decrypt(@RequestBody byte[] data) {
        CryDto cryDto = requestData(data);
        if(cryDto == null){
            return ResponseUtils.httpStatus2ApiResponse(CustomHttpStatus.INVALID_REQUEST_DATA);
        }
        return ResponseEntity.ok(ResponseUtils.success(cryService.decrypt(cryDto)));
    }

    private CryDto requestData(byte[] data){
        try {
            log.info("data:{}",data);
            EncryptionRequest request = objectMapper.readValue(data, EncryptionRequest.class);
            if (request == null || StringUtils.isEmpty(request.getEncryptedKey())
                    || StringUtils.isEmpty(request.getEncryptedData())) {
                return null;
            }

            String processedData = encryptionService.processEncryptedData(
                    request.getEncryptedKey(),
                    request.getEncryptedData()
            );
            log.info("processedData:{}",processedData);

            CryDto cryDto = objectMapper.readValue(processedData, CryDto.class);
            log.info("cryDto:{}",cryDto);
            return cryDto;

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}