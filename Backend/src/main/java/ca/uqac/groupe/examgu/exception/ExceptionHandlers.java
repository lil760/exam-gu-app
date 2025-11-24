package ca.uqac.groupe.examgu.exception;

import org.apache.catalina.connector.Response;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties;
import org.springframework.boot.actuate.web.exchanges.HttpExchange;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class ExceptionHandlers {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ExceptionResponses> handleException(ResponseStatusException ex) {
        return buildResponseEntity(ex, HttpStatus.valueOf(ex.getStatusCode().value()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponses> handleException(Exception ex) {
        return buildResponseEntity(ex, HttpStatus.BAD_REQUEST);
    }
    private ResponseEntity<ExceptionResponses> buildResponseEntity(Exception exc, HttpStatus status) {
ExceptionResponses error =new ExceptionResponses();
error.setStatus(status.value());
error.setMessage(exc.getLocalizedMessage());
error.setTimeStamp(System.currentTimeMillis());
return new ResponseEntity<>(error, status);
    }
}
