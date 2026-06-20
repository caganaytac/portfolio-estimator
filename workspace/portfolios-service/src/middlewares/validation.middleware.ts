import { Request, Response, NextFunction } from "express";
import { plainToInstance, ClassConstructor } from "class-transformer";
import { validate } from "class-validator";

// This is a "middleware factory": a function that RETURNS a middleware.
// Instead of writing a separate validation function for every route
// (one for CreatePortfolioDto, one for CreateHoldingDto, etc.), we write
// the logic ONCE here and pass in *which DTO class* to validate against.
//
// <T extends object> is a generic — it just means "T can be any class",
// and ClassConstructor<T> means "the actual class itself, not an instance
// of it" (e.g. you pass `CreatePortfolioDto`, not `new CreatePortfolioDto()`).
export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
  // This inner function IS the actual Express middleware.
  // It has the standard Express signature: (req, res, next).
  return async (req: Request, res: Response, next: NextFunction) => {
    // req.body is just a plain JavaScript object at this point — it has
    // no idea it's "supposed to be" a CreatePortfolioDto. It's whatever
    // JSON the client sent (e.g. { name: "Retirement", baseCurrency: "EUR" }).
    //
    // plainToInstance() takes that plain object and turns it into a real
    // INSTANCE of the dtoClass (e.g. an actual `CreatePortfolioDto` object).
    // This matters because class-validator's @IsString(), @IsEnum(), etc.
    // decorators only work on class instances, not plain objects.
    //
    // excludeExtraneousValues: false means "don't strip extra fields yet
    // at this step" — we let class-validator handle rejecting unknown
    // fields below via forbidNonWhitelisted.
    const dto = plainToInstance(dtoClass, req.body, {
      excludeExtraneousValues: false,
    });

    // validate() walks through every decorator on the DTO class
    // (@IsString, @IsEnum, @Length, @Matches, etc. — the ones we wrote
    // in create-portfolio.dto.ts and friends) and checks the actual
    // values in `dto` against those rules.
    //
    // It returns an ARRAY of errors — empty array if everything is valid.
    //
    // Options:
    // - whitelist: true
    //     → if the client sends a field that has NO decorator in the DTO
    //       (e.g. they tried to sneak in `userId` or `ownerType` on an
    //       update), that field gets silently stripped from `dto`.
    //
    // - forbidNonWhitelisted: true
    //     → instead of silently stripping unknown fields, this makes it
    //       an ERROR. So sending `{ name: "x", hacked: true }` will fail
    //       validation because `hacked` isn't a declared property.
    //       This is the stricter, safer option — it tells the client
    //       "this field doesn't exist" instead of quietly ignoring it.
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    // If validate() found ANY problems, we stop here and respond
    // with a 400 Bad Request — we never call next(), so the route
    // handler (e.g. the actual "create portfolio" logic) never runs.
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        // `errors` here is an array of ValidationError objects from
        // class-validator. Each one has:
        //   - e.property   → which field failed (e.g. "baseCurrency")
        //   - e.constraints → an object describing WHY it failed,
        //                     e.g. { isLength: "baseCurrency must be
        //                     longer than or equal to 3 characters" }
        //
        // We map over them to send back a clean, readable list instead
        // of dumping the raw class-validator objects (which contain a
        // lot of internal noise).
        errors: errors.map((e) => ({
          field: e.property,
          constraints: e.constraints,
        })),
      });
    }

    // If we get here, validation PASSED. We overwrite req.body with the
    // validated/transformed `dto` instance (which has had any extra
    // fields stripped by `whitelist: true`).
    //
    // This means your actual route handler can trust req.body completely —
    // it's guaranteed to match the DTO's shape and types.
    req.body = dto;

    // next() hands control to the next middleware/route handler in the
    // chain — e.g. the actual "create portfolio" logic.
    return next();
  };
}