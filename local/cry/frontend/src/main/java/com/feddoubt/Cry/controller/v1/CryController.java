package com.feddoubt.Cry.controller.v1;

import com.feddoubt.Cry.service.CryService;
import com.feddoubt.Cry.service.EncryptionService;
import com.feddoubt.common.Cry.config.message.CustomHttpStatus;
import com.feddoubt.common.Cry.config.message.ResponseUtils;
import com.feddoubt.model.Cry.dtos.CryDto;
import com.feddoubt.model.Cry.pojos.EncryptionRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@RestController
@RequestMapping("/api/v1/cry")
public class CryController {

    private final CryService cryService;
    private final EncryptionService encryptionService;

    public CryController(CryService cryService ,EncryptionService encryptionService){
        this.cryService = cryService;
        this.encryptionService = encryptionService;
    }
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/encrypt", consumes = {"application/json", "application/octet-stream"})
    public ResponseEntity<?> encrypt(@RequestBody EncryptionRequest request) throws Exception {
        CryDto cryDto = requestData(request);
        assert cryDto != null;
        return ResponseEntity.ok(ResponseUtils.success(cryService.encrypt(cryDto)));
    }

    @PostMapping("/decrypt")
    public ResponseEntity<?> decrypt(@RequestBody EncryptionRequest request) throws Exception {
        CryDto cryDto = requestData(request);
        assert cryDto != null;
        return ResponseEntity.ok(ResponseUtils.success(cryService.decrypt(cryDto)));
    }

    private CryDto requestData(EncryptionRequest request){
//    private CryDto requestData(byte[] data){
        try {
//            log.info("data:{}",data);
//            EncryptionRequest request = objectMapper.readValue(data, EncryptionRequest.class);
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