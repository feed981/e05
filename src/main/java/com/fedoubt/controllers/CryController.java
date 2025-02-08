package com.fedoubt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fedoubt.common.message.CustomHttpStatus;
import com.fedoubt.common.message.ResponseUtils;
import com.fedoubt.dtos.CryDto;
import com.fedoubt.pojos.EncryptionRequest;
import com.fedoubt.services.CryService;
import com.fedoubt.services.EncryptionService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
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

    private final EncryptionService encryptionService;

    public CryController(CryService cryService , EncryptionService encryptionService){
        this.cryService = cryService;
        this.encryptionService = encryptionService;
    }

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/encrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> encrypt(@RequestBody byte[] data) {

        try {
            log.info("encrypt data:{}",data);
            EncryptionRequest request = objectMapper.readValue(data, EncryptionRequest.class);
//            if (data == null || data.length == 0) {
//                return ResponseUtils.httpStatus2ApiResponse(CustomHttpStatus.INVALID_REQUEST_DATA);
//            }
            if (request == null || StringUtils.isEmpty(request.getEncryptedKey())
                    || StringUtils.isEmpty(request.getEncryptedData())) {
                return ResponseUtils.httpStatus2ApiResponse(CustomHttpStatus.INVALID_REQUEST_DATA);
            }

            String processedData = encryptionService.processEncryptedData(
                    request.getEncryptedKey(),
                    request.getEncryptedData()
            );
            log.info("processedData:{}",processedData);

            CryDto cryDto = objectMapper.readValue(processedData, CryDto.class);
            log.info("cryDto:{}",cryDto);
            return ResponseEntity.ok(ResponseUtils.success(cryService.encrypt(cryDto)));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseUtils.httpStatus2ApiResponse(CustomHttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping(value = "/decrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> decrypt(@RequestBody byte[] data) {
        if (data == null || data.length == 0) {
            return ResponseUtils.httpStatus2ApiResponse(CustomHttpStatus.INVALID_REQUEST_DATA);
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